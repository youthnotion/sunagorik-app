import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useMyClans, useSearchClans } from "@/hooks/clanHooks";
import ActivityIndicator from "@/components/ActivityIndicator";
import ShowClans from "@/components/ShowClans";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";


const Clan = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: myClans, isLoading: loadingMyClans } = useMyClans();
  const { data: searchData, isLoading: loadingSearch } = useSearchClans(searchTerm);

  const { data: myRequests } = useQuery({
    queryKey: ["my-join-requests"],
    queryFn: async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error || !user.user) throw new Error("Not authenticated");
      const { data, error: reqErr } = await supabase
        .from("clan_join_requests")
        .select("clan_id")
        .eq("user_id", user.user.id)
        .eq("status", "pending");
      if (reqErr) throw reqErr;
      return data?.map((r: any) => r.clan_id) || [];
    },
  });

  if (loadingMyClans) return <ActivityIndicator visible={true} />;

  return (
    <SafeAreaView className="flex-1">
      {!searching && (
        <View className="w-full p-4 flex flex-row justify-between items-center">
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setSearching(true)}
            className="bg-primary-700 rounded-lg px-2 py-1 shadow-md shadow-neutral-400/70"
          >
            <Text className="text-lg font-bold text-white">{t("Search")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push("/(form)/(clan)/create")}
            className="bg-green-700 rounded-lg px-2 py-1 shadow-md shadow-neutral-400/70"
          >
            <Text className="text-lg font-bold text-white">{t("Create")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {searching ? (
        <View className="flex-col gap-4 p-4">
          <View className="w-full flex flex-row justify-between pr-2">
            <Text className="text-xl font-bold">{t("Search")}</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setSearching(false);
                setSearchTerm("");
              }}
              className="bg-sunagorik rounded-lg px-2 py-1 shadow-md shadow-neutral-400/70"
            >
              <Text className="text-lg font-bold text-white">{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>

          <View className={`${loadingSearch ? "mb-16":"mb-4"}`}>
            <TextInput
              className="w-full bg-white border border-gray-300 rounded-xl p-4 font-JakartaMedium text-[15px] text-black"
              placeholder={t("Search Clan")}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {loadingSearch ? (
            <View><ActivityIndicator visible={true} /></View>
          ) : (
            <ShowClans data={searchData ?? []} joined={false} myRequests={myRequests ?? []} />
          )}
        </View>
      ) : (
        <ShowClans data={myClans ?? []} joined={true} myRequests={myRequests ?? []} />
      )}
    </SafeAreaView>
  );
}

export default Clan;
