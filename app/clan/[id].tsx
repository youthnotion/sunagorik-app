import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getImageUrl } from "@/lib/supabase";
import ActivityIndicator from "@/components/ActivityIndicator";
import { useCancelJoinRequest, useClanById, useIsClanAdmin, useRequestJoinClan } from "@/hooks/clanHooks";
import ClanMembersTab from "@/components/ClanMembersTab";
import ClanJoinRequestsTab from "@/components/ClanJoinRequestTab";
// import ClanJoinRequestsTab from "@/components/ClanJoinRequestsTab";

export default function ClanDetails() {
  const { id, joined, alreadyRequested } = useLocalSearchParams<{
    id: string;
    joined?: string;
    alreadyRequested?: string;
  }>();

  const requestJoinClan = useRequestJoinClan();
  const cancelRequest = useCancelJoinRequest();
  const {data:isAdmin} = useIsClanAdmin(id!);

  const isJoined = joined === "true";
  const [isRequested, setIsRequested] = useState(alreadyRequested === "true");

  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"posts" | "requests" | "members">( 
    "posts"
  );

  const { data: clan, isLoading } = useClanById(id!);

  const handleJoinRequest = (clanId: string) => {
    requestJoinClan.mutate(clanId, {
      onSuccess: () => Alert.alert("Request Sent", "Your join request has been sent successfully."),
      onError: (err: any) => Alert.alert("Error", err?.message || "Failed to send join request."),
    });
  };

  const handleCancelRequest = (clanId: string) => {
    cancelRequest.mutate(clanId, {
        onSuccess: () => Alert.alert("Request canceled", "Your join request has been canceled."),
        onError: (err: any) => Alert.alert("Error", err?.message || "Failed to send cancel request."),
    });
  };


  if (isLoading) return <ActivityIndicator visible={true} />;

  if (!clan) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500">Clan not found</Text>
      </SafeAreaView>
    );
  }

  // Fake list data for now (later you’ll replace with Supabase data)
  const dummyData: string[] = [];

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={dummyData}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <View className="items-center p-4 border-b border-gray-300">
              <Image
                source={{
                  uri:
                    getImageUrl("clan-logos", clan.logo_url) ||
                    "https://via.placeholder.com/150",
                }}
                className="w-24 h-24 rounded-lg mb-3"
                resizeMode="cover"
              />
              <Text className="text-2xl font-bold">{clan.name}</Text>
              {!!clan.description && (
                <Text className="text-gray-600 text-center text-lg font-medium mt-2">
                  {clan.description}
                </Text>
              )}
              {!isJoined && (
                <TouchableOpacity
                  onPress={() => {
                    if(isRequested) handleCancelRequest(id);
                    else handleJoinRequest(id);
                    setIsRequested(!isRequested);
                  }}
                  className={`mt-2 px-4 py-2 rounded-lg items-center ${
                    isRequested ? "bg-sunagorik" :  requestJoinClan.isLoading ? "bg-gray-400" : "bg-green-700"
                  }`}
                  disabled={requestJoinClan.isLoading}
                >
                  <Text className="text-white font-medium text-lg">
                    {isRequested ? "Cancel Request" : requestJoinClan.isLoading ? "Sending..." : "Send Join Request"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row justify-around mt-4">
              <TouchableOpacity
                onPress={() => setActiveTab("posts")}
                className={`flex-1 py-3 ${
                  activeTab === "posts"
                    ? "border-b-4 border-sunagorik"
                    : "border-b border-gray-300"
                }`}
              >
                <Text
                  className={`text-center text-lg ${
                    activeTab === "posts"
                      ? "font-bold text-sunagorik"
                      : "text-gray-500"
                  }`}
                >
                  Posts
                </Text>
              </TouchableOpacity>

              {isJoined && (
                <>
                {isAdmin && (
                  <TouchableOpacity
                    onPress={() => setActiveTab("requests")}
                    className={`flex-1 py-3 ${
                      activeTab === "requests"
                        ? "border-b-4 border-sunagorik"
                        : "border-b border-gray-300"
                    }`}
                  >
                    <Text
                      className={`text-center text-lg ${
                        activeTab === "requests"
                          ? "font-bold text-sunagorik"
                          : "text-gray-500"
                      }`}
                    >
                      Join Requests
                    </Text>
                  </TouchableOpacity>
                    )}
                  <TouchableOpacity
                    onPress={() => setActiveTab("members")}
                    className={`flex-1 py-3 ${
                      activeTab === "members"
                        ? "border-b-4 border-sunagorik"
                        : "border-b border-gray-300"
                    }`}
                  >
                    <Text
                      className={`text-center text-lg ${
                        activeTab === "members"
                          ? "font-bold text-sunagorik"
                          : "text-gray-500"
                      }`}
                    >
                      Members
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        }
        renderItem={null}
        ListEmptyComponent={
          <View className="p-6">
            {activeTab === "posts" && (
              <Text className="text-center text-gray-500 text-lg">
                There are no posts yet!
              </Text>
            )}
            {activeTab === "requests" && (
               <ClanJoinRequestsTab clanId={id!} isAdmin={isAdmin ?? false} />
            )}
            {activeTab === "members" && (
              <ClanMembersTab clanId={id!} isAdmin={isAdmin ?? false} />
            )}
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
}