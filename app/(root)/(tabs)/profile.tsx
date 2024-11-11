import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from "@/providers/AuthProvider";
import RemoteImage from "@/components/RemoteImage";
import { getImageUrl } from "@/lib/supabase";
import CustomButton from "@/components/CustomButton";

const Profile = () => {
  const { profile } = useAuth();

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

      {/* Profile Card */}
      <View className="bg-sunagorik m-4 p-4 rounded-xl shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="w-20 h-20 rounded-full border-2 border-gray-200 p-[2px]">
            <Image
              source={
                getImageUrl("avatars", profile?.avatar_url)
                  ? { uri: getImageUrl("avatars", profile?.avatar_url) }
                  : require("@/assets/images/avatar.png")
              }
              className="w-full h-full rounded-full"
            />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-2xl font-bold text-white">
              {profile?.username}
            </Text>
            <Text className="text-sm text-gray-200">
              {profile?.neighborhood}
            </Text>
          </View>
        </View>
        <Text className="text-base text-gray-200 mb-3 leading-relaxed">
          {profile?.about}
        </Text>
      </View>

      {/* First Row Stats */}
      <View className="flex-row px-4 gap-4 mb-4">
        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row items-start">
            <View className="p-1">
              <MaterialCommunityIcons
                name="file-document-outline"
                size={24}
                color="#CF322C"
              />
            </View>
            <View className="ml-2">
              <Text className="text-4xl font-bold text-sunagorik">28</Text>
              <Text className="text-sm text-gray-600">Reports Posted</Text>
            </View>
          </View>
        </View>
        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row items-start">
            <View className="p-1">
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={24}
                color="#CF322C"
              />
            </View>
            <View className="ml-2">
              <Text className="text-4xl font-bold text-sunagorik">6</Text>
              <Text className="text-sm text-gray-600">Resolved</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Second Row Stats */}
      <View className="flex-row px-4 gap-4">
        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row items-start">
            <View className="p-1">
              <MaterialCommunityIcons
                name="star-outline"
                size={24}
                color="#CF322C"
              />
            </View>
            <View className="ml-2">
              <Text className="text-4xl font-bold text-sunagorik">15</Text>
              <Text className="text-sm text-gray-600">Pending</Text>
            </View>
          </View>
        </View>
        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row items-start">
            <View className="p-1">
              <MaterialCommunityIcons
                name="account-check-outline"
                size={24}
                color="#CF322C"
              />
            </View>
            <View className="ml-2">
              <Text className="text-4xl font-bold text-sunagorik">
                {profile?.citizen_score}
              </Text>
              <Text className="text-sm text-gray-600">Citizen Score</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Achievements Card */}
      <View className="mt-4 px-4">
        <View className="bg-white p-4 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Achievements
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {/* First Time Reporter Badge */}
            <View className="items-center mb-4 w-[22%]">
              <View className="bg-gray-50 p-3 rounded-full">
                <MaterialCommunityIcons
                  name="medal-outline"
                  size={32}
                  color="#CF322C"
                />
              </View>
              <Text className="text-xs text-gray-600 mt-2 text-center">
                First Time{"\n"}Reporter
              </Text>
            </View>

            {/* Problem Solver Badge */}
            <View className="items-center mb-4 w-[22%]">
              <View className="bg-gray-50 p-3 rounded-full">
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={32}
                  color="#CF322C"
                />
              </View>
              <Text className="text-xs text-gray-600 mt-2 text-center">
                Problem{"\n"}Solver
              </Text>
            </View>

            {/* Top Contributor Badge */}
            <View className="items-center mb-4 w-[22%]">
              <View className="bg-gray-50 p-3 rounded-full">
                <MaterialCommunityIcons
                  name="trophy-outline"
                  size={32}
                  color="#CF322C"
                />
              </View>
              <Text className="text-xs text-gray-600 mt-2 text-center">
                Top{"\n"}Contributor
              </Text>
            </View>

            {/* Community Hero Badge */}
            <View className="items-center mb-4 w-[22%]">
              <View className="bg-gray-50 p-3 rounded-full">
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={32}
                  color="#CF322C"
                />
              </View>
              <Text className="text-xs text-gray-600 mt-2 text-center">
                Community{"\n"}Hero
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout Button */}
          <View className="flex-row w-full p-4">
            <View className="flex-1 mr-2">
              <CustomButton
                title="  Logout"
                IconLeft={() => (
                  <AntDesign name="logout" size={20} color="white" />
                )}
                onPress={() => {}}
              />
            </View>
            <View className="flex-1 ml-2">
              <CustomButton
                bgVariant="secondary"
                title="  Language"
                IconLeft={() => (
                  <Ionicons name="language" size={24} color="white" />
                )}
                onPress={() => {}}
              />
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
