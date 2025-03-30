import { useCreateFalseReport, useFalseReports } from "@/api/false_report";
import { usePost, useUpdatePostStatus } from "@/api/post/index";
import {
  useCreateSeverityRating,
  useSeverityRatings,
} from "@/api/severity_ratings";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import StarRating from "@/components/StarRating";
import { getImageUrl } from "@/lib/supabase";
import { formatDate, convertToBanglaNumber } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import {
  MaterialCommunityIcons
} from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useTranslation } from 'react-i18next';

const ReportDetailScreen = () => {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const { profile, role } = useAuth();
  const [isRateModalVisible, setRateModalVisible] = useState(false);
  const [rating, setRating] = useState(0);

  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const { data: report, isLoading, error } = usePost(Number(id));
  const { mutate: createSeverityRating } = useCreateSeverityRating();
  const { mutate: createFalseReport } = useCreateFalseReport();
  const { data: falseReports, refetch: refetchFalseReports } = useFalseReports(
    profile?.id,
    Number(id)
  );
  const { data: severityRating, refetch: refetchSeverityRating } =
    useSeverityRatings(Number(id), profile?.id);
  const { mutate: updatePostStatus } = useUpdatePostStatus();
  const [reportStatus, setReportStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

  if (!report) return null;

  const statusOptions = ["pending", "in progress", "resolved"];
  const hasUserReported = (falseReports?.length ?? 0) > 0;
  const userRating = severityRating?.rating ? severityRating?.rating : 0;

  const handleFalseReport = () => {
    Alert.alert(
      t('reportDetail.confirmReport.title'),
      t('reportDetail.confirmReport.message'),
      [
        {
          text: t('reportDetail.confirmReport.cancel'),
          style: "cancel",
        },
        {
          text: t('reportDetail.confirmReport.report'),
          style: "destructive",
          onPress: () =>
            createFalseReport(
              { post_id: Number(id), user_id: profile?.id },
              {
                onSuccess: () => {
                  Alert.alert(
                    t('reportDetail.reportSuccess.title'),
                    t('reportDetail.reportSuccess.message')
                  );
                  refetchFalseReports();
                },
                onError: (error) => {
                  Alert.alert(
                    t('reportDetail.reportError.title'),
                    t('reportDetail.reportError.message')
                  );
                },
              }
            ),
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
              source={
                report.reporter.avatar_url
                ? report.reporter.avatar_url.includes("https")
                  ? { uri: report.reporter.avatar_url }
                  : { uri: getImageUrl("avatars", report.reporter.avatar_url) }
                : require("@/assets/images/avatar.png")
              }
              className="w-full h-full rounded-full"
              />
            </View>
            <View className="ml-3">
              <Text className="text-sm font-JakartaMedium">
                {report.reporter.full_name}
              </Text>
              <View className="flex-row items-center gap-x-2">
                <FontAwesome name="star" size={14} color="#CF322C" />
                <Text className="text-xs font-JakartaMedium ml-1">
                  {i18n.language === 'bn' 
                    ? convertToBanglaNumber(report.reporter.citizen_score)
                    : report.reporter.citizen_score}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex flex-row items-center gap-x-2 mb-2">
            <Octicons name="location" size={20} color="#CF322C" />
            <Text className="text-md font-JakartaMedium">
              {report.neighborhood}
            </Text>
          </View>

          <View className="flex flex-row items-center justify-between mb-6">
            <View className="flex flex-row items-center gap-x-2">
              <FontAwesome name="star" size={20} color="#CF322C" />
              <Text className="text-md font-JakartaMedium">
                {t('reportDetail.severity')}: {i18n.language === 'bn' 
                  ? convertToBanglaNumber(report.severity_score)
                  : report.severity_score}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-x-2">
              <Octicons name="people" size={20} color="#CF322C" />
              <Text className="text-md font-JakartaMedium">
                {t('reportDetail.votes')}: {i18n.language === 'bn'
                  ? convertToBanglaNumber(report.votes)
                  : report.votes}
              </Text>
            </View>
          </View>

          <View className="flex-row w-full pb-4">
            <View className="flex-1 mr-2">
              <CustomButton
                title={
                  userRating > 0 
                    ? `  ${i18n.language === 'bn' ? convertToBanglaNumber(userRating) : userRating} ${t('reportDetail.rateButton.rated')}` 
                    : `  ${t('reportDetail.rateButton.rate')}`
                }
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
                title={hasUserReported 
                  ? `  ${t('reportDetail.reportButton.reported')}` 
                  : `  ${t('reportDetail.reportButton.report')}`}
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
                {t(`report.category.categories.${report.category}`)}
              </Text>
            </View>

            {/* Status */}
            <Pressable
              className={`items-center flex-1 ${
                role === "authority"
                  ? "bg-sunagorik/20 active:bg-sunagorik/40 rounded-xl"
                  : ""
              }`}
              onPress={() => {
                setReportStatus(report.status);
                role === "authority" && setStatusModalVisible(true);
              }}
            >
              <MaterialCommunityIcons
                name="progress-check"
                size={32}
                color="#cf322c"
              />
              <Text
                className={`text-sm capitalize font-JakartaMedium mt-1 text-gray-500`}
              >
                {t(`common.status.${report.status}`)}
              </Text>
            </Pressable>

            {/* Reported At */}
            <View className="items-center flex-1">
              <MaterialCommunityIcons
                name="clock-outline"
                size={32}
                color="#cf322c"
              />
              <Text className="text-sm font-JakartaMedium text-gray-500 text-center mt-1">
                {formatDate(report.created_at, i18n.language)}
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

          <Text className="text-xl font-JakartaBold mb-8">
            {t('reportDetail.rateModal.title')}
          </Text>

          <View className="items-center mb-8">
            <StarRating rating={rating} onRatingChange={setRating} size={40} />
          </View>

          <View className="flex-row w-full pb-4">
            <View className="flex-1 mr-2">
              <CustomButton
                title={t('reportDetail.rateModal.submit')}
                onPress={() => {
                  createSeverityRating(
                    {
                      post_id: Number(id),
                      user_id: profile?.id,
                      rating,
                    },
                    {
                      onSuccess: () => {
                        Alert.alert(
                          t('reportDetail.rateSuccess.title'),
                          t('reportDetail.rateSuccess.message')
                        );
                        setRateModalVisible(false);
                        refetchSeverityRating();
                      },
                      onError: (error) => {
                        Alert.alert(
                          t('reportDetail.rateError.title'),
                          t('reportDetail.rateError.message')
                        );
                        setRateModalVisible(false);
                      },
                    }
                  );
                }}
              />
            </View>
            <View className="flex-1 ml-2">
              <CustomButton
                title={t('reportDetail.rateModal.close')}
                onPress={() => setRateModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isStatusModalVisible}
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View className="bg-white p-4 rounded-t-2xl absolute bottom-0 w-full h-1/2 border-t-2 border-x-2 border-sunagorik/50">
          <View className="items-center mb-4">
            <View className="w-16 h-1 bg-gray-300 rounded-full" />
          </View>

          <Text className="text-lg font-JakartaSemiBold mb-4">
            {t('reportDetail.statusModal.title')}
          </Text>

          <View className="flex-row justify-between">
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                activeOpacity={0.8}
                onPress={() => setReportStatus(status)}
                className={`py-4 px-6 rounded-lg ${
                  reportStatus === status ? "bg-sunagorik" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-center font-JakartaMedium capitalize ${
                    reportStatus === status ? "text-white" : "text-gray-700"
                  }`}
                >
                  {t(`common.status.${status}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <InputField
            placeholder={t('reportDetail.statusModal.notePlaceholder')}
            multiline
            numberOfLines={4}
            keyboardType="default"
            textAlignVertical="top"
            label={t('reportDetail.statusModal.note')}
            value={statusNote}
            onChangeText={setStatusNote}
            editable={reportStatus !== report.status}
            className={`${reportStatus === report.status ? "opacity-30" : ""}`}
          />

          <View className="flex-row w-full mt-4">
            <View className="flex-1 mr-2">
              <CustomButton
                title={t('reportDetail.statusModal.submit')}
                disabled={reportStatus === report.status}
                bgVariant={reportStatus === report.status ? "secondary" : "primary"}
                onPress={() => {
                  updatePostStatus(
                    {
                      id: Number(id),
                      status: reportStatus.toLowerCase(),
                      status_updated_by: profile?.id,
                      status_note: statusNote,
                    },
                    {
                      onSuccess: () => {
                        Alert.alert(
                          t('reportDetail.statusSuccess.title'),
                          t('reportDetail.statusSuccess.message')
                        );
                        setStatusModalVisible(false);
                      },
                      onError: (error) => {
                        Alert.alert(
                          t('reportDetail.statusError.title'),
                          t('reportDetail.statusError.message')
                        );
                        setStatusModalVisible(false);
                      },
                    }
                  );
                }}
              />
            </View>
            <View className="flex-1 ml-2">
              <CustomButton
                bgVariant="secondary"
                title={t('reportDetail.statusModal.close')}
                onPress={() => setStatusModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ReportDetailScreen;
