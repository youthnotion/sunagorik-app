import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import { useJoinRequests, useManageJoinRequest } from "@/hooks/clanHooks";
import { getImageUrl } from "@/lib/supabase";

interface Props {
  clanId: string;
  isAdmin: boolean;
}

export default function ClanJoinRequestsTab({ clanId, isAdmin }: Props) {
  const { data: members, isLoading } = useJoinRequests(clanId);
  const manageRequest = useManageJoinRequest();

  if (isLoading) return <Text className="text-center p-6">Loading members...</Text>;

  if (!members || members.length === 0) return <Text className="text-center text-gray-500 text-lg">No members listed yet.</Text>;

  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.user.id}
      renderItem={({ item }) => (
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
            <View className={`flex-col max-w-[70%] ${isAdmin ? "" : "max-w-full"}`}>
              <Text className="text-lg font-medium">{item.user.full_name || "Unknown"}</Text>
              <Text className="text-gray-500">Role: {item.role || "Unknown"}</Text>
            </View>
          </View >
          <View className="flex flex-col gap-2 ">
            <TouchableOpacity
              className="w-[80px] px-3 py-1 bg-green-600 rounded"
              onPress={() =>{ 
                manageRequest.mutate(
                  { requestId: item.id, status: "approved" },
                  {
                    onSuccess: () => {
                      Alert.alert("Success!", "Join request has been acceppted successfully!");
                    },
                    onError: (err) => {
                      Alert.alert("Failed!", "Failed to accept join request.")
                    },
                  }
                );
              }}
            >
              <Text className="text-white text-md text-center font-medium">Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-[80px] px-3 py-1 bg-sunagorik rounded"
              onPress={() => manageRequest.mutate({ requestId: item.id, status: "rejected" })}
            >
              <Text className="text-white text-md text-center font-medium">Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}