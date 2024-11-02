import CustomButton from "@/components/CustomButton";
import StarRating from "@/components/StarRating";
import { formatDate } from "@/lib/utils";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const ReportDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [isRateModalVisible, setRateModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const report = {
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
    description:
      "In our community, a serious drainage issue has been causing water to overflow, disrupting daily activities and posing significant risks to residents' safety and health. The overflowing water not only creates unsanitary conditions but also makes roads difficult to navigate, affecting both pedestrians and drivers. The situation is especially concerning during rainfall, which further worsens the problem and leaves many frustrated and unable to go about their daily routines. We urge the local authorities to take immediate action to address this drainage problem. A timely response is essential to prevent further inconvenience and safeguard the community from potential hazards. Repairing the drainage system will not only restore normalcy but also improve the area’s hygiene and accessibility, making it safer and more comfortable for everyone. Let’s work together to resolve this issue for the well-being of our neighborhood!",
  };

  if (!report) return null;

  const handleFalseReport = () => {
    Alert.alert(
        "Confirm", 
        "Are you sure you want to report this as false?", 
        [
          { 
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Report",
            style: "destructive",
            onPress: () => console.log("Reported"),
          },
        ],
        {
          cancelable: true,
        }
      );
  };


  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        

        <Image
          source={{ uri: report.image }}
          className="w-full h-[300px]"
          resizeMode="contain"
        />

        <View className="p-4">
          <Text className="text-2xl font-JakartaBold mb-4">{report.title}</Text>

          <View className="flex flex-row items-center gap-x-2 mb-4">
            <Octicons name="location" size={20} color="#CF322C" />
            <Text className="text-md font-JakartaMedium">{report.address}</Text>
          </View>

          <View className="flex flex-row items-center justify-between mb-6">
            <View className="flex flex-row items-center gap-x-2">
              <FontAwesome name="star" size={20} color="#CF322C" />
              <Text className="text-md font-JakartaMedium">
                Severity: {report.severity}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-x-2">
              <Octicons name="people" size={20} color="#CF322C" />
              <Text className="text-md font-JakartaMedium">
                Votes: {report.vote_number}
              </Text>
            </View>
          </View>

          <View className="flex-row w-full pb-4">
            <View className="flex-1 mr-2">
              <CustomButton
                title="  Rate Severity"
                onPress={() => setRateModalVisible(true)}
                IconLeft={() => (
                  <FontAwesome name="star" size={24} color="white" />
                )}
              />
            </View>
            <View className="flex-1 ml-2">
              <CustomButton
                title="  False Report"
                onPress={handleFalseReport}
                IconLeft={() => (
                  <MaterialIcons
                    name="report"
                    size={24}
                    color="white"
                    className=""
                  />
                )}
              />
            </View>
          </View>

          <View className="bg-general-500 rounded-lg p-4">
            <View className="flex flex-row justify-between mb-2">
              <Text className="text-md font-JakartaMedium text-gray-500">
                Reported At
              </Text>
              <Text className="text-md font-JakartaMedium text-gray-500">
                {formatDate(report.created_at)}
              </Text>
            </View>

            <View className="flex flex-row justify-between mb-2">
              <Text className="text-md font-JakartaMedium text-gray-500">
                Posted By
              </Text>
              <Text className="text-md font-JakartaMedium text-gray-500">
                {report.reporter.first_name} {report.reporter.last_name}
              </Text>
            </View>

            <View className="flex flex-row justify-between mb-2">
              <Text className="text-md font-JakartaMedium text-gray-500">
                Category
              </Text>
              <Text className="text-md font-JakartaMedium text-gray-500">
                {report.category}
              </Text>
            </View>

            <View className="flex flex-row justify-between">
              <Text className="text-md font-JakartaMedium text-gray-500">
                Report Status
              </Text>
              <Text
                className={`text-md capitalize font-JakartaMedium ${
                  report.report_status === "resolved"
                    ? "text-green-500"
                    : "text-sunagorik"
                }`}
              >
                {report.report_status}
              </Text>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-md font-JakartaMedium">
              {report.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={isRateModalVisible}
        animationType="slide"
        onRequestClose={() => setRateModalVisible(false)}
      >
        <View className="bg-white p-4 rounded-t-2xl absolute bottom-0 w-full h-[37%] border-t-2 border-x-2 border-sunagorik/50">
          <View className="items-center mb-4">
            <View className="w-16 h-1 bg-gray-300 rounded-full" />
          </View>

          <Text className="text-xl font-JakartaBold mb-8">Rate Severity</Text>

          <View className="items-center mb-8">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size={40}
            />
          </View>

          <View className="flex-row w-full pb-4">
            <View className="flex-1 mr-2">
              <CustomButton
                title="Submit"
                onPress={() => setRateModalVisible(false)}
              />
            </View>
            <View className="flex-1 ml-2">
              <CustomButton
                title="Close"
                onPress={() => setRateModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ReportDetailScreen;
