import { useCreateFalseReport, useFalseReports } from "@/api/false_report";
import { usePost } from "@/api/post";
import { useCreateSeverityRating, useSeverityRatings } from "@/api/severity_ratings";
import CustomButton from "@/components/CustomButton";
import StarRating from "@/components/StarRating";
import { getImageUrl } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  View
} from "react-native";

const ReportDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { profile } = useAuth();
  const [isRateModalVisible, setRateModalVisible] = useState(false);
  const [rating, setRating] = useState(0);

  const { data: report, isLoading, error } = usePost(Number(id));
  const { mutate: createSeverityRating } = useCreateSeverityRating();
  const { mutate: createFalseReport } = useCreateFalseReport();
  const { data: falseReports, refetch: refetchFalseReports } = useFalseReports(profile?.id, Number(id));
  const { data: severityRating, refetch: refetchSeverityRating } = useSeverityRatings(Number(id), profile?.id);
  if (!report) return null;

  const hasUserReported = (falseReports?.length ?? 0) > 0;
  const userRating = severityRating?.rating ? severityRating?.rating : 0;

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
          onPress: () => createFalseReport({ post_id: Number(id), user_id: profile?.id }, {
            onSuccess: () => {
              Alert.alert("Success", "Your report has been submitted successfully!");
              refetchFalseReports();
            },
            onError: (error) => {
              Alert.alert("Error", "Failed to submit report. Please try again later.");
            }
          }),
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
        className="flex-1 "
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Image
          source={{ uri: getImageUrl("posts", report.image) || undefined }}
          className="w-full h-[300px]"
          resizeMode="contain"
        />

        <View className="p-4">
          <Text className="text-2xl font-JakartaBold mb-4">{report.title}</Text>

          <View className="mb-4 flex-row items-center">
            <View className="w-12 h-12 rounded-full border-2 border-sunagorik p-[2px]">
            <Image
              source={{
                uri: "https://flmuyyvdnvexbgkqehth.supabase.co/storage/v1/object/public/avatars/a65c1a16-deb7-45a2-a6bd-27fd9b1caeb3/avatar.jpg",
              }}
              className="w-full h-full rounded-full"
            />
            </View>
            <View className="ml-3">
              <Text className="text-sm font-JakartaMedium">
                {report.reporter.full_name}
              </Text>
              <View className="flex-row items-center">
                <FontAwesome name="star" size={14} color="#CF322C" />
                <Text className="text-sm font-JakartaMedium ml-1">
                  {report.reporter.rating}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex flex-row items-center gap-x-2 mb-2">
            <Octicons name="location" size={20} color="#CF322C" />
            <Text className="text-md font-JakartaMedium">{report.neighborhood}</Text>
          </View>

          <View className="flex flex-row items-center justify-between mb-6">
            <View className="flex flex-row items-center gap-x-2">
              <FontAwesome name="star" size={20} color="#CF322C" />
              <Text className="text-md font-JakartaMedium">
                Severity: {report.severity_score}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-x-2">
              <Octicons name="people" size={20} color="#CF322C" />
              <Text className="text-md font-JakartaMedium">
                Votes: {report.votes}
              </Text>
            </View>
          </View>

          <View className="flex-row w-full pb-4">
            <View className="flex-1 mr-2">
              <CustomButton
                title={userRating > 0 ? `  ${userRating} Rated ` : "  Rate Severity"}
                onPress={() => setRateModalVisible(true)}
                disabled={userRating > 0}
                bgVariant={userRating > 0 ? "secondary" : "primary"}
                IconLeft={() => (
                  <FontAwesome name="star" size={24} color="white" />
                )}
              />
            </View>
            <View className="flex-1 ml-2">
              <CustomButton
                title={hasUserReported ? "  Reported" : "  False Report"}
                onPress={handleFalseReport}
                disabled={hasUserReported}
                bgVariant={hasUserReported ? "secondary" : "primary"}
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

          <View className="bg-white rounded-lg p-3 flex-row justify-between">
            {/* Category */}
            <View className="items-center flex-1">
              <MaterialCommunityIcons
                name="shape-outline"
                size={32}
                color="#cf322c"
              />
              <Text className="text-sm font-JakartaMedium text-gray-500 text-center mt-1">
                {report.category}
              </Text>
            </View>

            {/* Status */}
            <View className="items-center flex-1">
              <MaterialCommunityIcons
                name="progress-check"
                size={32}
                color="#cf322c"
              />
              <Text
                className={`text-sm capitalize font-JakartaMedium mt-1 text-gray-500`}
              >
                {report.status}
              </Text>
            </View>

            {/* Reported At */}
            <View className="items-center flex-1">
              <MaterialCommunityIcons
                name="clock-outline"
                size={32}
                color="#cf322c"
              />
              <Text className="text-sm font-JakartaMedium text-gray-500 text-center mt-1">
                {formatDate(report.created_at)}
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
            <StarRating rating={rating} onRatingChange={setRating} size={40} />
          </View>

          <View className="flex-row w-full pb-4">
            <View className="flex-1 mr-2">
              <CustomButton
                title="Submit"
                onPress={() => {
                  createSeverityRating({ 
                    post_id: Number(id), 
                    user_id: profile?.id, 
                    rating 
                  }, {
                    onSuccess: () => {
                      Alert.alert(
                        "Success",
                        "Your severity rating has been submitted successfully!"
                      );
                      setRateModalVisible(false);
                      refetchSeverityRating();
                    },
                    onError: (error) => {
                      Alert.alert(
                        "Error",
                        "Failed to submit rating. Please try again."
                      );
                      setRateModalVisible(false);
                    }
                  });
                }}
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
