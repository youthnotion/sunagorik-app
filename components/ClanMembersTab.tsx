import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import { getImageUrl } from "@/lib/supabase";
import { useClanMembers, useRemoveMember, useUpdateMemberRole } from "@/api/clan";
import { useAuth } from "@/providers/AuthProvider";

interface Props {
  clanId: string;
  isAdmin: boolean;
}

export default function ClanMembersTab({ clanId, isAdmin }: Props) {
  const { data: members, isLoading } = useClanMembers(clanId);
  const removeMember = useRemoveMember(clanId);
  const updateRole = useUpdateMemberRole(clanId);
  const { session } = useAuth();
  const currentUserId = session?.user?.id ?? null;

  

  const handleRemove = (userId: string, isSelf: boolean) => {
    Alert.alert(isSelf ? "Leave Clan" : "Remove Member", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeMember.mutate(userId),
      },
    ]);
  };

  const handleRoleChange = (userId: string, currentRole: "admin" | "member") => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    updateRole.mutate({ userId, role: newRole });
  };

  if (isLoading) return <Text className="text-center p-6">Loading members...</Text>;

  if (!members || members.length === 0) return <Text className="text-center text-gray-500 text-lg">No members listed yet.</Text>;

  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.user.id}
      renderItem={({ item }) => {
        const isSelf = item.user.id === currentUserId;
        return (
          <View className="w-full flex-row justify-between items-center border-b border-gray-200 pb-3 mb-2">
            <View className=" w-[75%] flex flex-row items-center gap-2">
              <Image
                source={{
                  uri: item.user.avatar_url
                    ? item.user.avatar_url.startsWith("http")
                      ? item.user.avatar_url
                      : getImageUrl("avatars", item.user.avatar_url) || "https://via.placeholder.com/40"
                    : "https://via.placeholder.com/40",
                }}
                className="w-12 h-12 rounded-full mr-4"
              />
              <View className={`flex-col max-w-[75%] `}>
                <Text className="text-lg font-medium">{item.user.full_name || "Unknown"}</Text>
                <Text className="text-gray-500">Role: {item.role}</Text>
              </View>
            </View>
            <View className="flex flex-col gap-2 ">
              <TouchableOpacity
                className={`w-[80px] px-3 py-1 bg-gray-200 rounded ${isAdmin ? "" : "hidden"}`}
                onPress={() => handleRoleChange(item.user.id, item.role)} 

              >
                <Text className="text-md text-center font-medium">{item.role === "admin" ? "Demote" : "Promote"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`w-[80px] px-3 py-1 bg-sunagorik rounded ${isAdmin || isSelf ? "" : "hidden"}`}
                onPress={() => handleRemove(item.user.id, isSelf)}
              >
                <Text className={`text-white text-md text-center font-medium`}>{isSelf ? "Leave" : "Remove"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }}
    />
  );
}