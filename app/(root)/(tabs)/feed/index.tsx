import { FilterParams, usePostList } from "@/api/post/index";
import ActivityIndicator from "@/components/ActivityIndicator";
import ReportCard from "@/components/ReportCard";
import { images } from "@/constants";
import { useAuth } from "@/providers/AuthProvider";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTER_OPTIONS = ["My Posts", "Pending", "In Progress", "Resolved", "Severe"];

const usePostFilters = (userId?: string) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterParams = useMemo<FilterParams>(() => {
    const filters: FilterParams = {
      limit: 5,
    };

    if (selectedFilters.includes("Severe")) {
      filters.severity = true;
    }
    
    if (selectedFilters.includes("My Posts") && userId) {
      filters.user_id = userId;
    }

    const statusFilters = selectedFilters
      .filter(status => !["Severe", "My Posts"].includes(status))
      .map(status => status.toLowerCase());

    if (statusFilters.length > 0) {
      filters.status = statusFilters;
    }

    return filters;
  }, [selectedFilters, userId]);

  return {
    selectedFilters,
    setSelectedFilters,
    filterParams
  };
};

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

const FilterItem = memo(({ status, isSelected, onPress }: { 
  status: string;
  isSelected: boolean; 
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className={`p-2 rounded-lg mr-2 ${
      isSelected ? "bg-sunagorik" : "bg-gray-200"
    }`}
  >
    <Text
      className={`text-sm ${
        isSelected ? "text-white" : "text-gray-700"
      }`}
    >
      {status}
    </Text>
  </Pressable>
));

const Feed = () => {
  const { profile } = useAuth();
  const { selectedFilters, setSelectedFilters, filterParams } = usePostFilters(profile?.id);
  
  const { 
    data, 
    error, 
    isLoading,
    isFetching, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage, 
    refetch 
  } = usePostList(filterParams);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <ActivityIndicator size="small" color="#000" />;
  };

  const flattenedPosts = data?.pages.flatMap(page => page.data) ?? [];

  const renderItem = useCallback(({ item }) => (
    <MemoizedReportCard post={item} />
  ), []);

  const renderFilterItem = useCallback(({ item: status }) => (
    <FilterItem
      status={status}
      isSelected={selectedFilters.includes(status)}
      onPress={() => {
        setSelectedFilters((prev) =>
          prev.includes(status)
            ? prev.filter((item) => item !== status)
            : [...prev, status]
        );
      }}
    />
  ), [selectedFilters]);

  if (isLoading) {
    return <ActivityIndicator visible={true} />;
  }

  return (
    <SafeAreaView className="px-2">
      <FlatList
        data={FILTER_OPTIONS}
        renderItem={renderFilterItem}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-2"
      />
      <FlatList
        data={flattenedPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isFetching}
        onRefresh={refetch}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={EmptyListComponent}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      />
    </SafeAreaView>
  );
};

export default Feed;
