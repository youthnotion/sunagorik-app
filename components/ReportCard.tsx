import { getImageUrl } from "@/lib/supabase";
import { formatDate, convertToBanglaNumber } from "@/lib/utils";
import { Report } from "@/types/type";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Octicons from "@expo/vector-icons/Octicons";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

const RideCard = ({
  post: {
    id,
    title,
    neighborhood,
    created_at,
    status,
    category,
    severity_score,
    image,
    reporter,
  },
}: {
  post: Report;
}) => {
  const { t, i18n } = useTranslation();
  
  return (
    <Link href={`/feed/${id}`} asChild>
      <Pressable className="flex flex-row items-center justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3">
        <View className="flex flex-col items-center justify-center p-3">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-col gap-y-2 flex-1">
              <View className="flex flex-row items-center">
                <Text className="text-xl font-JakartaBold mb-2" numberOfLines={2}>
                  {title}
                </Text>
              </View>

              <View className="w-full mx-0 rounded-md overflow-hidden">
                <Image
                  source={{ uri: getImageUrl("posts", image) || undefined }}
                  resizeMode="cover"
                  className="w-full h-[200px] "
                />
              </View>

              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center gap-x-2">
                  <Octicons name="location" size={20} color="#CF322C" />
                  <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                    {neighborhood}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-x-2">
                  <FontAwesome name="star" size={20} color="#CF322C" />
                  <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                    {i18n.language === 'bn' ? convertToBanglaNumber(severity_score) : severity_score}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex flex-col w-full mt-5 bg-general-500 rounded-lg p-3 items-start justify-center">
            <View className="flex flex-row items-center w-full justify-between mb-1">
              <Text className="text-md font-JakartaMedium text-gray-500">
                {t('feed.reportCard.reportedAt')}
              </Text>
              <Text className="text-md font-JakartaMedium text-gray-500">
                {formatDate(created_at, i18n.language)}
              </Text>
            </View>

            <View className="flex flex-row items-center w-full justify-between mb-1">
              <Text className="text-md font-JakartaMedium text-gray-500">
                {t('feed.reportCard.postedBy')}
              </Text>
              <Text className="text-md font-JakartaMedium text-gray-500">
                {reporter.full_name}
              </Text>
            </View>

            <View className="flex flex-row items-center w-full justify-between mb-1">
              <Text className="text-md font-JakartaMedium text-gray-500">
                {t('feed.reportCard.category')}
              </Text>
              <Text className="text-md font-JakartaMedium text-gray-500">
                {t(`report.category.categories.${category}`)}
              </Text>
            </View>

            <View className="flex flex-row items-center w-full justify-between mb-1">
              <Text className="text-md font-JakartaMedium text-gray-500">
                {t('feed.reportCard.status')}
              </Text>
              <Text
                className={`text-md capitalize font-JakartaMedium text-gray-500 ${
                  status === "resolved" ? "text-green-500" : "text-sunagorik"
                }`}
              >
                {t(`common.status.${status}`)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default RideCard;
