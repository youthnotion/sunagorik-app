import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormContext } from "../../../providers/ProfileFormProvider";

export default function FormBody() {
  const { formData, updateProfileData } = useFormContext();
  const router = useRouter();

  const [about, setAbout] = useState(formData.about || "");

  const isFormValid = about.trim();

  const handleNext = () => {
    if (isFormValid) {
      updateProfileData({
        about,
      });
      router.push("/(form)/(profile)/avatar");
    }
  };


  return (
    <SafeAreaView className="flex-1 p-2">
        
      {/* About Input */}
      <View className="mb-4">
        <Text className="text-gray-700 text-base mb-2 font-medium">
          About
        </Text>
        <TextInput
          value={about}
          onChangeText={setAbout}
          placeholder="Tell us about yourself (optional)"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="w-full bg-white p-4 rounded-lg border border-gray-200 h-32"
        />
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
