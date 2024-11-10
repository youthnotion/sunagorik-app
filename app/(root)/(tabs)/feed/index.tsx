import { FilterParams, userPostList } from "@/api/post";
import ReportCard from "@/components/ReportCard";
import { images } from "@/constants";
import { useAuth } from "@/providers/AuthProvider";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityIndicator from "@/components/ActivityIndicator";


const Feed = () => {
  const { profile } = useAuth();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  // Transform UI status to database status
  const getFilterParams = () => {
    const filters: FilterParams = {};
    
    selectedFilters.forEach(status => {
      if (status === "Severe") {
        filters.severity = true;
      } else if (status === "My Posts") {
        filters.user_id = profile?.id;
      } else {
        if (!filters.status) filters.status = [];
        filters.status.push(status.toLowerCase());
      }
    });
    
    return filters;
  };

  const { data: posts, error, isLoading } = userPostList(getFilterParams());

  if (isLoading) {
    return <ActivityIndicator visible={true} />;
  }

  return (
    <SafeAreaView className="px-2">
      <View className="flex flex-row justify-between">
        {["My Posts", "Initiated", "In Progress", "Resolved", "Severe"].map(
          (status) => (
            <Pressable
              key={status}
              onPress={() => {
                setSelectedFilters((prev) =>
                  prev.includes(status)
                    ? prev.filter((item) => item !== status)
                    : [...prev, status]
                );
              }}
              className={`border-2 border-[#d6d4d4] rounded-md p-2 bg-sunagorik my-2 ${
                selectedFilters.includes(status) ? "bg-sunagorik" : "bg-white"
              }`}
            >
              <Text
                className={`${
                  selectedFilters.includes(status) ? "text-white" : "text-black"
                } font-JakartaBold text-xs`}
              >
                {status}
              </Text>
            </Pressable>
          )
        )}
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={posts}
        renderItem={({ item }) => <ReportCard post={item} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 160 }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="We can't find any posts right now!"
                  resizeMode="contain"
              />
              <Text className="text-sm">
                We can't find any posts right now!
              </Text>
            </>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Feed;
