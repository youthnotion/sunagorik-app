import { View, Text, TouchableOpacity, Image } from "react-native";
import { useFormContext } from "../../../providers/PostFormProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Alert } from "react-native";

export default function ImageUpload() {
  const { formData, updateFormData } = useFormContext();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(formData.image || null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error taking photo:", error);
    }
  };

  const handleSubmission = async () => {
    if (image) {
      try {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Please allow location access to submit the report."
          );
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Update form with image and location
        updateFormData({
          image,
          location: { latitude, longitude },
        });

        // Submit the complete form
        try {
          // Show loading alert
          //   Alert.alert(
          //     'Submitting Report',
          //     'Please wait while we submit your report...'
          //   );

          // const response = await submitFormToBackend(formData);

          // Show success message
          Alert.alert(
            "Success!",
            "Your report has been submitted successfully.",
            [
              {
                text: "OK",
                onPress: () => {
                  // Reset form data
                  updateFormData({});
                  // Navigate back to home
                  router.replace("/(tabs)/home");
                },
              },
            ]
          );

          console.log(formData);
        } catch (error) {
          Alert.alert("Error", "Failed to submit report. Please try again.", [
            {
              text: "OK",
              style: "cancel",
            },
          ]);
          console.error("Submission error:", error);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to get location. Please try again.", [
          {
            text: "OK",
            style: "cancel",
          },
        ]);
        console.error("Location error:", error);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 p-2">
      <View className="flex-1">
        {/* Image Preview */}
        {image ? (
          <View className="h-2/3 items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mb-4">
            <Image
              source={{ uri: image }}
              className="w-full h-full rounded-lg"
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => setImage(null)}
              className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="h-2/3 items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mb-4">
            <Ionicons name="image-outline" size={48} color="gray" />
            <Text className="text-gray-500 mt-2">No image selected</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-4">
          <TouchableOpacity
            onPress={takePhoto}
            className="flex-1 flex-row items-center justify-center bg-sunagorik p-4 rounded-lg"
          >
            <Ionicons name="camera" size={24} color="white" className="mr-2" />
            <Text className="text-white font-semibold ml-2">Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickImage}
            className="flex-1 flex-row items-center justify-center bg-sunagorik p-4 rounded-lg"
          >
            <Ionicons name="images" size={24} color="white" className="mr-2" />
            <Text className="text-white font-semibold ml-2">Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleSubmission}
          disabled={!image}
          className={`p-4 rounded-lg ${image ? "bg-sunagorik" : "bg-gray-300"}`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
