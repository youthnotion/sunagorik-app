import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Clan, ClanJoinRequest, ClanMember } from "@/types/clan";
import { Alert } from "react-native";
import { useAuth } from "@/providers/AuthProvider";

function slugify(name: string, description?: string) {
    const base = `${name} ${description || ""}`
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    return base;
}

export function useClanAdminCount(clanId: string) {
    return useQuery({
        queryKey: ["clan-admin-count", clanId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("clan_members")
                .select("user_id", { count: "exact" })
                .eq("clan_id", clanId)
                .eq("role", "admin");

            if (error) throw error;

            return {
                count: data?.length ?? 0,
                admins: data?.map((m) => m.user_id) ?? [],
            };
        },
        enabled: !!clanId,
    });
}


export function useMyClans() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["my-clans"],
    queryFn: async () => {
      const userId = session?.user?.id;
      if (!userId) throw new Error("Not authenticated");

      // ✅ fetch clans with member count
      const { data, error } = await supabase
        .from("clan_members")
        .select(
          `
          clan:clans (
            *,
            clan_members(count)
          )
        `
        )
        .eq("user_id", userId);

      if (error) throw error;

      const clans = (data ?? [])
        .map((r: any) => {
          const clan = Array.isArray(r.clan) ? r.clan[0] : r.clan;
          return {
            ...clan,
            total_members: clan?.clan_members?.[0]?.count ?? 0,
          };
        })
        .filter(Boolean);

      return clans as (Clan & { total_members: number })[];
    },
  });
}


export function useClanById(clanId: string) {
    return useQuery({
        queryKey: ["clan", clanId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("clans")
                .select("*")
                .eq("id", clanId)
                .single();
            if (error) throw error;
            return data as Clan;
        },
        enabled: !!clanId,
    });
}

export function useClanMembers(clanId: string) {
    return useQuery({
        queryKey: ["clan-members", clanId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("clan_members")
                .select("*, user:profiles(id, full_name, avatar_url)")
                .eq("clan_id", clanId)
                .order("joined_at", { ascending: true });
            if (error) throw error;
            return data as (ClanMember & {
                user: { id: string; full_name?: string | null; avatar_url?: string | null };
            })[];
        },
        enabled: !!clanId,
    });
}


export function useJoinRequests(clanId: string) {
    return useQuery({
        queryKey: ["join-requests", clanId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("clan_join_requests")
                .select("*, user:profiles(id, full_name, avatar_url)")
                .eq("clan_id", clanId)
                .eq("status", "pending")
                .order("requested_at", { ascending: true });
            if (error) throw error;
            return data as (ClanJoinRequest & {
                user: { id: string; full_name?: string | null; avatar_url?: string | null };
            })[];
        },
        enabled: !!clanId,
    });
}


export function useCreateClan() {
    const qc = useQueryClient();
    const { session } = useAuth();

    return useMutation({
        mutationFn: async (payload: { name: string; description?: string; logo_url?: string }) => {
            const userId = session?.user?.id;
            if (!userId) throw new Error("Not authenticated");
            const created_by = userId;
            const slug = slugify(payload.name, payload.description);

            const { data: existing, error: checkErr } = await supabase
                .from("clans")
                .select("id")
                .or(`name.eq.${payload.name},slug.eq.${slug}`);
            if (checkErr) throw checkErr;
            if (existing && existing.length > 0) throw new Error("Clan name already taken");

            const { count: totalCount, error: countError } = await supabase
                .from("clan_members")
                .select("clan_id", { count: "exact", head: true })
                .eq("user_id", userId);
            if (countError) throw countError;
            if ((totalCount ?? 0) >= Number(process.env.EXPO_PUBLIC_MAX_CLANS)) {
                throw new Error(`You can only be in up to ${process.env.EXPO_PUBLIC_MAX_CLANS} clans!`);
            }

            const { data, error: createError } = await supabase
                .from("clans")
                .insert({ ...payload, slug, created_by })
                .select("*")
                .single();
            if (createError) throw createError;

            await supabase.from("clan_members").insert({
                clan_id: data.id,
                user_id: userId,
                role: "admin",
            });

            return data as Clan;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["my-clans"] }),
    });
}

export function useJoinClan() {
    const qc = useQueryClient();
    const { session } = useAuth();
    return useMutation({
        mutationFn: async (clanId: string) => {
            const userId = session?.user?.id;
            if (!userId) throw new Error("Not authenticated");

            const { count: totalCount, error: countError } = await supabase
                .from("clan_members")
                .select("clan_id", { count: "exact", head: true })
                .eq("user_id", userId);
            if (countError) throw countError;
            if ((totalCount ?? 0) >= Number(process.env.EXPO_PUBLIC_MAX_CLANS)) {
                throw new Error(`You can only be in up to ${process.env.EXPO_PUBLIC_MAX_CLANS} clans!`);
            }

            const { error: joinError } = await supabase
                .from("clan_members")
                .insert({ clan_id: clanId, user_id: userId, role: "member" });
            if (joinError) throw joinError;
        },
        onSuccess: (_, clanId) => {
        qc.invalidateQueries({ queryKey: ["my-clans"] });
        qc.invalidateQueries({ queryKey: ["clan-members", clanId] });
    }});
}

export function useRequestJoinClan() {
    const qc = useQueryClient();
    const { session } = useAuth();
    return useMutation({
        mutationFn: async (clanId: string) => {
            const userId = session?.user?.id;
            if (!userId) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("clan_join_requests")
                .insert({ clan_id: clanId, user_id: userId, status: "pending" });
            if (error) throw error;
        },
        onSuccess: (_, clanId) => {
        qc.invalidateQueries({ queryKey: ["join-requests", clanId] });
        qc.invalidateQueries({ queryKey: ["my-join-requests"] });
    }});
}


export function useManageJoinRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({
            requestId,
            status,
        }: {
            requestId: string;
            status: "approved" | "rejected";
        }) => {
        
            const { data: req, error: fetchErr } = await supabase
                .from("clan_join_requests")
                .select("*")
                .eq("id", requestId)
                .single();
            if (fetchErr) throw fetchErr;

            if (status === "approved") {
                const { error: insErr } = await supabase
                .from("clan_members")
                .insert({ clan_id: req.clan_id, user_id: req.user_id, role: "member" });
                if (insErr) throw insErr;
                const { error: updErr } = await supabase
                .from("clan_join_requests")
                .update({ status })
                .eq("id", requestId);
                if (updErr) throw updErr;
            } else {
        
                const { error: requestError } = await supabase
                .from("clan_join_requests")
                .delete()
                .eq("id", requestId);
                if (requestError) throw requestError;
                console.log("Request deleted:", requestId, "from clan:", req.clan_id);
                console.log(requestError, "Request deletion error:");
            }

            return { clan_id: req.clan_id };
        },
        onSuccess: ({ clan_id }) => {
            qc.invalidateQueries({ queryKey: ["join-requests", clan_id] });
            qc.invalidateQueries({ queryKey: ["clan-members", clan_id] });
            qc.invalidateQueries({ queryKey: ["my-join-requests"] });    
        },
    });
}


export function useRemoveMember(clanId: string) {
    const qc = useQueryClient();
    const { data: adminInfo } = useClanAdminCount(clanId);
    return useMutation({
        mutationFn: async (userId: string) => {
            if (!adminInfo) {
                throw new Error("Unable to check admin count");
            }
            if (adminInfo.count === 1 && adminInfo.admins[0] === userId) {
                throw new Error("last-admin");
            }
            const { error } = await supabase
                .from("clan_members")
                .delete()
                .match({ clan_id: clanId, user_id: userId });
            if (error) throw error;

            const { error: requestError } = await supabase
                .from("clan_join_requests")
                .delete()
                .match({ clan_id: clanId, user_id: userId });

            console.log("Remove member request error:", requestError);
            console.log("user Deleted from clan:", userId, "clan:", clanId);

            if (requestError) throw requestError;
        },
        onError: (err: any) => {
            if (err.message === "last-admin") {
                Alert.alert(
                    "Cannot Remove!",
                    "You are the last admin of this clan. Assign another admin before leaving."
                );
            } else {
                Alert.alert("Error", err.message || "Failed to remove member");
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["clan-members", clanId] });
            qc.invalidateQueries({ queryKey: ["clan-admin-count", clanId] });
            qc.invalidateQueries({ queryKey: ["is-admin", clanId] });
            qc.invalidateQueries({ queryKey: ["my-clans"] });
            qc.invalidateQueries({ queryKey: ["my-join-requests"] });
            qc.invalidateQueries({ queryKey: ["join-requests", clanId] });
            qc.invalidateQueries({ queryKey: ["clan", clanId] });
            qc.invalidateQueries({ queryKey: ["clan-members", clanId] });
        }
    });
}

export function useUpdateMemberRole(clanId: string) {
    const qc = useQueryClient();
    const { data: adminInfo } = useClanAdminCount(clanId);
    return useMutation({
        mutationFn: async (params: { userId: string; role: "admin" | "member" }) => {
            if (!adminInfo) {
                throw new Error("Unable to check admin count");
            }
            if (adminInfo.count === 1 && adminInfo.admins[0] === params.userId) {
                throw new Error("last-admin");
            }
            const { error } = await supabase
                .from("clan_members")
                .update({ role: params.role })
                .match({ clan_id: clanId, user_id: params.userId });
            if (error) throw error;
        },
        onError: (err: any) => {
            if (err.message === "last-admin") {
                Alert.alert(
                    "Action Not Allowed!",
                    "You are the last admin of this clan. Assign another admin before demoting yourself."
                );
            } else {
                Alert.alert("Error", err.message || "Failed to remove member");
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["clan-members", clanId] });
            qc.invalidateQueries({ queryKey: ["clan-admin-count", clanId] });
            qc.invalidateQueries({ queryKey: ["is-admin", clanId] });
        }
    });
}


export function useSearchClans(term: string) {
    const { session } = useAuth();

    return useQuery({
        queryKey: ["search-clans", term],
        queryFn: async () => {
            const userId = session?.user?.id;
            if (!userId) throw new Error("Not authenticated");

            const { data: myMemberships, error: memErr } = await supabase
                .from("clan_members")
                .select("clan_id")
                .eq("user_id", userId);

            if (memErr) throw memErr;

            const excludeIds = (myMemberships ?? []).map((m) => m.clan_id);

            let q = supabase
                .from("clans")
                .select(`
                    *,
                    clan_members:clan_members(count)
                `)
                .order("created_at", { ascending: false });

            if (term.trim().length > 0) {
                q = q.or(
                    `slug.ilike.%${term}%,name.ilike.%${term}%,description.ilike.%${term}%`
                );
            }

            if (excludeIds.length > 0) {
                q = q.not("id", "in", `(${excludeIds.join(",")})`);
            }

            const { data, error } = await q;
            if (error) throw error;

            const clansWithCount = (data ?? []).map((clan) => ({
                ...clan,
                total_members: clan.clan_members?.[0]?.count ?? 0,
            }));

            return clansWithCount as (Clan & { total_members: number })[];
        },
        enabled: true,
    });
}



export function useCancelJoinRequest() { 
    const qc = useQueryClient(); 
    const { session } = useAuth();
    return useMutation({ 
        mutationFn: async (clanId: string) => { 
            const userId = session?.user?.id;
            if (!userId) throw new Error("Not authenticated");
            const { error } = await supabase 
                .from("clan_join_requests") 
                .delete() 
                .match({ clan_id: clanId, user_id: userId, status: "pending" }); 
                if (error) throw error; 
        }, 
        onSuccess: (_, clanId) => { 
            qc.invalidateQueries({ queryKey: ["join-requests", clanId] }); 
            qc.invalidateQueries({ queryKey: ["my-join-requests"] });
        }, 
    }); 
}

export function useIsClanAdmin(clanId: string) {
    const { session } = useAuth();
    return useQuery({
        queryKey: ["is-admin", clanId],
        queryFn: async () => {
            const userId = session?.user?.id;
            if (!userId) throw new Error("Not authenticated"); 
            const { data, error } = await supabase
                .from("clan_members")
                .select("role")
                .eq("clan_id", clanId)
                .eq("user_id", userId)
                .single();

            if (error) throw error;
            return data?.role === "admin";
        },
    });
}

export function useMyClanReq() {
    const { session } = useAuth();
    return useQuery({
        queryKey: ["my-join-requests"],
        queryFn: async () => {
            const userId = session?.user?.id;
            if (!userId) throw new Error("Not authenticated");
            const { data: user, error } = await supabase.auth.getUser();
            if (error || !user.user) throw new Error("Not authenticated");
            const { data, error: reqErr } = await supabase
                .from("clan_join_requests")
                .select("clan_id")
                .eq("user_id", userId)
                .eq("status", "pending");
            if (reqErr) throw reqErr;
            return data?.map((r: any) => r.clan_id) || [];
        },
    });
}

export function useSearchMyClans(term: string) {
    const { session } = useAuth();

    return useQuery({
        queryKey: ["search-my-clans", term],
        queryFn: async () => {
            const userId = session?.user?.id;
            if (!userId) throw new Error("Not authenticated");

            const { data: myMemberships, error: memErr } = await supabase
                .from("clan_members")
                .select("clan_id")
                .eq("user_id", userId);

            if (memErr) throw memErr;

            const joinedClanIds = (myMemberships ?? []).map((m) => m.clan_id);

            if (joinedClanIds.length === 0) return [];

            const { data: clans, error: clanErr } = await supabase
                .from("clans")
                .select(`
                    *,
                    clan_members:clan_members(count)
                `)
                .in("id", joinedClanIds)
                .or(`name.ilike.%${term}%,slug.ilike.%${term}%,description.ilike.%${term}%`);

            if (clanErr) throw clanErr;

            const clansWithCount = (clans ?? []).map((clan) => ({
                ...clan,
                total_members: clan.clan_members?.[0]?.count ?? 0,
            }));

            console.log("Search My Clans Result:", clansWithCount);
            

            return clansWithCount;
        },
        enabled: !!term,
    });
}

