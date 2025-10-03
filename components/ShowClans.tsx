import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import { getImageUrl } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useCancelJoinRequest, useRequestJoinClan } from "@/api/clan";


export default function ShowClans({ data, myRequests, joined }: { data: any[]; myRequests: any[]; joined: boolean }) {
    
    const router = useRouter();
    const requestJoinClan = useRequestJoinClan();
    const cancelRequest = useCancelJoinRequest();

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

    return (
        data?.length === 0 ? (
            joined ? (
            <Text className="text-center text-gray-500 text-xl ">
                You have not joined any clans yet.
            </Text>) : (
                <Text className="text-center text-gray-500 text-xl ">No clans found.</Text>
            )
        ):(
        <FlatList
            className="w-full"
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                const alreadyRequested = myRequests?.includes(item.id);

                return(
                    <View className="mx-2 border border-sunagorik rounded-xl p-2 mb-3">
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() =>
                            router.push({
                                pathname: "/(root)/(tabs)/clan/[id]",
                                params: { 
                                id: item.id,
                                joined: joined ? "true" : "false",
                                alreadyRequested: alreadyRequested ? "true" : "false",
                                },
                            })
                            }
                        >
                            {/* ✅ Flex row: left (logo + name), right (members count) */}
                            <View className="w-full flex-row items-center justify-between">
                            {/* Left side */}
                            <View className="flex-row items-center gap-2">
                                <Image
                                source={{ uri: getImageUrl("clan-logos", item.logo_url ?? null) || 'https://via.placeholder.com/100' }}
                                className="w-16 h-16 rounded-full"
                                resizeMode="cover" 
                                />
                                <Text className="font-bold text-2xl">{item.name}</Text>
                            </View>

                            {/* Right side */}
                            <Text className="text-xl text-gray-600">
                                {item.total_members}/{process.env.EXPO_PUBLIC_MAX_CLAN_MEMBERS}
                            </Text>
                            </View>
                        </TouchableOpacity>

                        {!joined && (
                            <TouchableOpacity
                                onPress={() => {
                                    if (alreadyRequested) handleCancelRequest(item.id);
                                    else handleJoinRequest(item.id);
                                }}
                                className={`mt-2 px-4 py-2 rounded-lg items-center ${
                                    item.total_members >= Number(process.env.EXPO_PUBLIC_MAX_CLAN_MEMBERS)
                                    ? "bg-gray-400"
                                    : alreadyRequested
                                    ? "bg-sunagorik"
                                    : requestJoinClan.isLoading
                                    ? "bg-gray-400"
                                    : "bg-green-700"
                                }`}
                                disabled={
                                    requestJoinClan.isLoading ||
                                    item.total_members >= Number(process.env.EXPO_PUBLIC_MAX_CLAN_MEMBERS)
                                }
                            >
                                <Text className="text-white font-medium">
                                    {item.total_members >= Number(process.env.EXPO_PUBLIC_MAX_CLAN_MEMBERS)
                                        ? "Clan Full"
                                        : alreadyRequested
                                        ? "Cancel Request"
                                        : requestJoinClan.isLoading
                                        ? "Sending..."
                                        : "Send Join Request"
                                    }
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                )
            }}
        />
      )
    );
}
