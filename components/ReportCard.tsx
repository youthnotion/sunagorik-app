import { formatDate } from "@/lib/utils";
import { Ride } from "@/types/type";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Octicons from "@expo/vector-icons/Octicons";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
const RideCard = ({
  ride: {
    id,
    title,
    address,
    created_at,
    reporter,
    report_status,
    category,
    severity,
    vote_number,
    image,
  },
}: {
  ride: Ride;
}) => (
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
                source={{ uri: image }}
                resizeMode="cover"
                className="w-full h-[200px] "
              />
            </View>

            <View className="flex flex-row items-center gap-x-2">
              <Octicons name="location" size={20} color="#CF322C" />
              <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                {address}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-x-2">
                <FontAwesome name="star" size={20} color="#CF322C" />
                <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                  {severity}
                </Text>
              </View>

              <View className="flex flex-row items-center gap-x-2">
                <Octicons name="people" size={20} color="#CF322C" />
                <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                  {vote_number}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex flex-col w-full mt-5 bg-general-500 rounded-lg p-3 items-start justify-center">
          <View className="flex flex-row items-center w-full justify-between mb-1">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Reported At
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {formatDate(created_at)}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-1">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Posted By
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {reporter.first_name} {reporter.last_name}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-1">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Category
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {category}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-1">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Report Status
            </Text>
            <Text
              className={`text-md capitalize font-JakartaMedium text-gray-500 ${
                report_status === "resolved"
                  ? "text-green-500"
                  : "text-sunagorik"
              }`}
            >
              {report_status}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  </Link>
);

export default RideCard;
