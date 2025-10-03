import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import ActivityIndicator from "@/components/ActivityIndicator";
import ShowClans from "@/components/ShowClans";
import { useTranslation } from "react-i18next";
import { useMyClanReq, useMyClans, useSearchClans, useSearchMyClans } from "@/api/clan";
import CustomButton from "@/components/CustomButton";


const Clan = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: myClans, isLoading: loadingMyClans } = useMyClans();
  const { data: searchData, isLoading: loadingSearch } = useSearchClans(searchTerm);
  const { data: searchMyData, isLoading: loadingMySearch } = useSearchMyClans(searchTerm);
  

  const { data: myRequests } = useMyClanReq();

  const isSearchingMyClans = !searching && searchTerm.length > 0;
  const showData = isSearchingMyClans ? searchMyData : myClans;
  const isLoading = isSearchingMyClans ? loadingMySearch : loadingMyClans;

  if (isLoading) return <ActivityIndicator visible={true} />;

  return (
    <SafeAreaView className="flex-1 px-2">
      {!searching && (
        <View className="flex-col gap-4 p-4 mt-6 items-center">
          <View className="flex-row w-full mt-2 gap-2">
            <View className="flex-1">
              <CustomButton
                title={"Join Clan"}
                onPress={() => {
                  setSearching(true);
                  setSearchTerm("");
                }}
              />
            </View>
            <View className="flex-1">
              <CustomButton
                title={"Create Clan"}
                onPress={() => router.push("/(form)/(clan)/create")}
              />
            </View>
          </View>

          <TextInput
            className="w-full bg-white border border-gray-300 rounded-xl py-4 px-4 font-JakartaMedium text-[15px] text-black"
            placeholder={t("Search My Clans")}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      )}

      {searching ? (
        <View className="flex-col items-center gap-4 p-4">
          <View className="w-full flex flex-row justify-between pr-2">
            <Text className="text-xl font-bold">{t("Search")}</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setSearching(false);
                setSearchTerm("");
              }}
              className="bg-sunagorik rounded-lg px-2 py-1 shadow-md shadow-neutral-400/70"
            >
              <Text className="text-lg font-bold text-white">{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>

          <View className={`${loadingSearch ? "w-full mb-16" : "w-full mb-4"}`}>
            <TextInput
              className="w-full bg-white border border-gray-300 rounded-xl p-4 font-JakartaMedium text-[15px] text-black"
              placeholder={t("Search Clan")}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {loadingSearch ? (
            <View ><ActivityIndicator visible={true} /></View>
          ) : (
            <View className=" w-full flex-col items-center">
              <ShowClans data={searchData ?? []} joined={false} myRequests={myRequests ?? []} />
            </View>
          )}
        </View>
      ) : (
        <View className=" w-full flex-col items-center">
          <ShowClans data={showData ?? []} joined={true} myRequests={myRequests ?? []} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Clan;