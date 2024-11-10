import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormContext } from "../../../providers/ProfileFormProvider";

export default function FormBody() {
  const { formData, updateProfileData } = useFormContext();
  const router = useRouter();

  const [username, setUsername] = useState(formData.username || "");
  const [fullName, setFullName] = useState(formData.fullName || "");
  const [neighborhood, setNeighborhood] = useState(formData.neighborhood || "");

  const isFormValid = username.trim() && fullName.trim() && neighborhood.trim();

  const handleNext = () => {
    if (isFormValid) {
      updateProfileData({
        username,
        fullName,
        neighborhood,
      });
      router.push("/(form)/(profile)/about");
    }
  };


  return (
    <SafeAreaView className="flex-1 p-2">
      {/* Username Input */}
      <View className="mb-4">
        <Text className="text-gray-700 text-base mb-2 font-medium">Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          className="w-full bg-white p-4 rounded-lg border border-gray-200"
        />
      </View>

      {/* Full Name Input */}
      <View className="mb-4">
        <Text className="text-gray-700 text-base mb-2 font-medium">
          Full Name
        </Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
          className="w-full bg-white p-4 rounded-lg border border-gray-200"
        />
      </View>

      {/* Neighborhood Input */}
      <View className="mb-4">
        <Text className="text-gray-700 text-base mb-2 font-medium">
          Neighborhood
        </Text>
        <TextInput
          value={neighborhood}
          onChangeText={setNeighborhood}
          placeholder="Enter neighborhood"
          className="w-full bg-white p-4 rounded-lg border border-gray-200"
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
