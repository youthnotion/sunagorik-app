import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import { getImageUrl } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useCancelJoinRequest, useRequestJoinClan } from "@/hooks/clanHooks";



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
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                const alreadyRequested = myRequests?.includes(item.id);

                return(
                <View className=" mx-2 border border-sunagorik rounded-xl p-2 mb-3">
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() =>
                          router.push({
                            pathname: "/clan/[id]",
                            params: { 
                              id: item.id,
                              joined: joined ? "true" : "false",
                              alreadyRequested: alreadyRequested ? "true" : "false",
                            },
                          })
                        }

                    >
                    <View className="flex flex-col gap-2">
                        <View className="flex flex-row items-center gap-2">
                            <Image
                                source={{ uri: getImageUrl("clan-logos", item.logo_url ?? null) || 'https://via.placeholder.com/100' }}
                                className="w-16 h-16 rounded-lg "
                                resizeMode="cover" />
                            <Text className="font-bold text-2xl">{item.name}</Text>
                        </View> 
                        {!!item.description && <Text className="text-gray-600 text-lg">{item.description}</Text>}
                    </View> 
                    </TouchableOpacity>
                    {!joined && (
                        <TouchableOpacity
                            onPress={() => {
                                if(alreadyRequested) handleCancelRequest(item.id);
                                else handleJoinRequest(item.id)
                            }}
                            className={`mt-2 px-4 py-2 rounded-lg items-center ${
                                alreadyRequested ? "bg-sunagorik" : requestJoinClan.isLoading ? "bg-gray-400" : "bg-green-700"
                            }`}
                            disabled={requestJoinClan.isLoading}
                        >
                            <Text className="text-white font-medium">
                                {alreadyRequested ? "Cancel Request" : requestJoinClan.isLoading ? "Sending..." : "Send Join Request"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}}
        />
      )
    );
}
