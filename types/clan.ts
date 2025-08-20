export type Clan = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  created_by: string;
  created_at: string;
};

export type ClanMember = {
  clan_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
};

export type ClanJoinRequest = {
  id: string;
  clan_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
};
