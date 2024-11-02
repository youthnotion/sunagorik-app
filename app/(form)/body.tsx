import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useFormContext } from "../../providers/FormProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from "@/components/StarRating";
import ActivityIndicator from "@/components/ActivityIndicator";

export default function FormBody() {
  const { formData, updateFormData } = useFormContext();
  const router = useRouter();

  const [title, setTitle] = useState(formData.title || "");
  const [details, setDetails] = useState(formData.description || "");
  const [severity, setSeverity] = useState(formData.severity || 0);

  const isFormValid = title.trim() && severity > 0;

  const handleNext = () => {
    if (isFormValid) {
      updateFormData({
        title,
        description: details,
        severity,
      });
      router.push("/(form)/image");
    }
  };

  const handleRatingChange = (rating: number) => {
    setSeverity(rating);
  };

  return (
    <SafeAreaView className="flex-1 p-2">
      {/* Title Input */}
      <View className="mb-4">
        <Text className="text-gray-700 text-base mb-2 font-medium">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          className="w-full bg-white p-4 rounded-lg border border-gray-200"
        />
      </View>

      {/* Details Input */}
      <View className="mb-4">
        <Text className="text-gray-700 text-base mb-2 font-medium">
          Details
        </Text>
        <TextInput
          value={details}
          onChangeText={setDetails}
          placeholder="Enter details (optional)"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="w-full bg-white p-4 rounded-lg border border-gray-200 h-32"
        />
      </View>

      {/* Severity */}
      <Text className="text-gray-700 text-base mb-2 font-medium">Severity</Text>
      <View className="mb-6 justify-center items-center bg-white p-8 rounded-lg border border-gray-200">
        <StarRating rating={severity} onRatingChange={handleRatingChange} />
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={handleNext}
        disabled={!isFormValid}
        className={`p-4 rounded-lg ${
          isFormValid ? "bg-sunagorik" : "bg-gray-300"
        }`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Next
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
