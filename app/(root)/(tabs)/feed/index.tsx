import { FilterParams, usePostList } from "@/api/post/index";
import ActivityIndicator from "@/components/ActivityIndicator";
import { ActivityIndicator as RNActivityIndicator } from "react-native";
import ReportCard from "@/components/ReportCard";
import { images } from "@/constants";
import { useAuth } from "@/providers/AuthProvider";
import React, { useState, useCallback, memo } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const MemoizedReportCard = memo(ReportCard);

const EmptyListComponent = memo(() => (
  <View className="flex flex-col items-center justify-center">
    <Image
      source={images.noResult}
      className="w-40 h-40"
      alt="We can't find any posts right now!"
      resizeMode="contain"
    />
    <Text className="text-sm">
      We can't find any posts right now!
    </Text>
  </View>
));

const Feed = () => {
  const { profile } = useAuth();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const getFilterParams = useCallback(() => {
    const filters: FilterParams = {
      limit: 5,
    };
    
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
  }, [selectedFilters, profile?.id]);

  const { 
    data, 
    error, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage, 
    refetch 
  } = usePostList(getFilterParams());

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <RNActivityIndicator size="small" color="#000" />;
  };

  const flattenedPosts = data?.pages.flatMap(page => page.data) ?? [];

  const renderItem = useCallback(({ item }) => (
    <MemoizedReportCard post={item} />
  ), []);

  if (isLoading) {
    return <ActivityIndicator visible={true} />;
  }

  return (
    <SafeAreaView className="px-2">
      <View className="flex flex-row justify-between">
        {["My Posts", "Pending", "In Progress", "Resolved", "Severe"].map(
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
        data={flattenedPosts}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 160 }}
        ListEmptyComponent={EmptyListComponent}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isLoading}
        onRefresh={refetch}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={5}
      />
    </SafeAreaView>
  );
};

export default Feed;
