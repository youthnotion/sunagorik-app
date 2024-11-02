import ReportCard from "@/components/ReportCard";
import { images } from "@/constants";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const recentRides = [
  {
    report_id: "1",
    title: "Water Clogging for 3 Days",
    address: "Housing Estate, Maizdee",
    latitude: "27.717245",
    longitude: "85.323961",
    severity: 3,
    vote_number: 10,
    category: "Water Clogging",
    report_status: "in progress",
    created_at: "2024-08-12 05:19:20.620007",
    reporter: {
      reporter_id: "2",
      first_name: "Mahadi",
      last_name: "Sajjad",

      rating: "4.60",
    },
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Maijdee%2CNoakhal.jpg/4000px-Mapcarta.jpg",
  },
  {
    report_id: "2",
    title: "Road blocked by construction materials",
    address: "Master Para, Maizdee Bazar",
    latitude: "18.609116",
    longitude: "77.165873",
    severity: 4,
    vote_number: 55,
    category: "Road Blocked",
    report_status: "in progress",
    created_at: "2024-08-12 06:12:17.683046",
    reporter: {
      reporter_id: "1",
      first_name: "Ashfaqur",
      last_name: "Rahman",

      rating: "4.80",
    },
    image:
      "https://media-cdn.tripadvisor.com/media/photo-c/1280x250/06/13/09/5f/noakhali.jpg",
  },
  {
    report_id: "3",
    title: "Drainage problem",
    address: "Mosjid Market, Maizdee",
    latitude: "45.815011",
    longitude: "15.981919",
    severity: 1,
    vote_number: 8,
    category: "Drainage Problem",
    report_status: "in progress",
    created_at: "2024-08-12 08:49:01.809053",
    reporter: {
      reporter_id: "1",
      first_name: "Mumtahin",
      last_name: "Sifat",

      rating: "4.80",
    },
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Maijdee%2CNoakhal.jpg/4000px-Mapcarta.jpg",
  },

  {
    report_id: "4",
    title: "Pothole on the road",
    address: "Court Road, Maizdee",
    latitude: "34.655531",
    longitude: "133.919795",
    severity: 5,
    vote_number: 12,
    category: "Pothole",
    report_status: "in progress",
    created_at: "2024-08-12 18:43:54.297838",
    reporter: {
      reporter_id: "3",
      first_name: "Imranul",
      last_name: "Karim",
      rating: "4.70",
    },
    image:
      "https://media-cdn.tripadvisor.com/media/photo-c/1280x250/06/13/09/5f/noakhali.jpg",
  },
];

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  return (
    <SafeAreaView style={styles.container} className="px-2">
      <View className="flex flex-row justify-between">
        {["Recent", "Initiated", "In Progress", "Resolved", "Severe"].map(
          (status) => (
            <Pressable
              key={status}
              onPress={() => {
                setSelectedStatus((prev) =>
                  prev.includes(status)
                    ? prev.filter((item) => item !== status)
                    : [...prev, status]
                );
              }}
              className={`border-2 border-[#d6d4d4] rounded-md p-2 bg-sunagorik my-2 ${
                selectedStatus.includes(status) ? "bg-sunagorik" : "bg-white"
              }`}
            >
              <Text
                className={`${
                  selectedStatus.includes(status) ? "text-white" : "text-black"
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
        data={recentRides}
        renderItem={({ item }) => <ReportCard ride={item} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 160 }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent reports found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent reports found!</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Feed;
