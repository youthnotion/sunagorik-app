import { useUserReportStats } from "@/api/post/index";
import ActivityIndicator from "@/components/ActivityIndicator";
import CustomButton from "@/components/CustomButton";
import { getImageUrl, supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, View, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import '../../../lib/i18n';

const Profile = () => {
  const { profile, refreshProfile } = useAuth();
  const { data: userReportStats, isLoading, refetch: refetchUserReportStats } = useUserReportStats(profile?.id);
  const [refreshing, setRefreshing] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const { t } = useTranslation(); 

  const onRefresh = async () => {
    setRefreshing(true);
    setTimestamp(Date.now()); // Update timestamp to force new image URL
    
    try {
      await Promise.all([
        refreshProfile(),
        refetchUserReportStats()
      ]);
    } catch (error) {
      console.error("Error refreshing profile:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    router.replace("/(auth)/sign-up");
  }

  if (isLoading) {
    return <ActivityIndicator visible={true} />
  }

  const imageUrl = profile?.avatar_url
    ? profile?.avatar_url.startsWith("https")
    ? profile.avatar_url
    : `${getImageUrl("avatars", profile.avatar_url)}?t=${timestamp}`
    : null;

  return (
    <SafeAreaView>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Profile Card */}
        <View className="bg-sunagorik m-4 p-4 rounded-xl shadow-sm">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.push("/(form)/(profile)/avatar")}
              activeOpacity={0.8}
            >
              <View className="w-20 h-20 rounded-full border-2 border-gray-200 bg-gray-200 p-[2px]">
                <Image
                  source={
                    imageUrl
                      ? { 
                          uri: imageUrl,
                          cache: 'reload'
                        }
                      : require("@/assets/images/avatar.png")
                  }
                  className="w-full h-full rounded-full"
                />
              </View>
            </TouchableOpacity>
            <View className="ml-4 flex-1">
              <Text className="text-2xl font-bold text-white">
                {profile?.full_name}
              </Text>
              {/* <Text className="text-xs font-bold text-white">
                @{profile?.username}
              </Text> */}
              <Text className="text-sm text-gray-200">
                {profile?.neighborhood}
              </Text>
            </View>
            {/* <TouchableOpacity 
              onPress={() => router.push("/(form)/(profile)/body")}
              className="p-2 bg-white/20 rounded-full"
            >
              <MaterialCommunityIcons name="pencil" size={20} color="white" />
            </TouchableOpacity> */}
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
                <Text className="text-4xl font-bold text-sunagorik">{userReportStats?.total}</Text>
                <Text className="text-sm text-gray-600">{t('profile.reportsPosted')}</Text>
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
                <Text className="text-4xl font-bold text-sunagorik">{userReportStats?.resolved || 0}</Text>
                <Text className="text-sm text-gray-600">{t('profile.resolved')}</Text>
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
                  name="progress-clock"
                  size={24}
                  color="#CF322C"
                />
              </View>
              <View className="ml-2">
                <Text className="text-4xl font-bold text-sunagorik">{userReportStats?.in_progress || 0}</Text>
                <Text className="text-sm text-gray-600">{t('profile.inProgress')}</Text>
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
                  {(userReportStats?.total || 0) + ((userReportStats?.resolved || 0) * 10) + ((userReportStats?.in_progress || 0) * 5)}
                </Text>
                <Text className="text-sm text-gray-600">{t('profile.citizenScore')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements Card */}
        {/* <View className="mt-4 px-4">
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Achievements
            </Text>

            <View className="flex-row flex-wrap justify-between">
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
        </View> */}

        {/* Logout Button */}
        <View className="flex-row w-full p-4 mt-6">
          <View className="flex-1 mr-2">
            <CustomButton
              title={t('profile.logout')}
              IconLeft={() => (
                <AntDesign name="logout" size={20} color="white" />
              )}
              onPress={() => {
                logout();
              }}
            />
          </View>
          <View className="flex-1 ml-2">
            <CustomButton
              bgVariant="secondary"
              title={t('profile.language')}
              IconLeft={() => (
                <Ionicons name="language" size={24} color="white" />
              )}
              onPress={() => setShowLanguageSwitcher(true)}
            />
          </View>
        </View>

        <LanguageSwitcher 
          visible={showLanguageSwitcher} 
          onClose={() => setShowLanguageSwitcher(false)} 
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
