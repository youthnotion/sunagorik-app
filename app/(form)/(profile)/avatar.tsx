import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormContext } from "../../../providers/ProfileFormProvider";

import { useUpdateProfile } from "@/api/profile";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { decode } from "base64-arraybuffer";
import { Alert } from "react-native";

export default function ImageUpload() {
  const { formData, updateProfileData } = useFormContext();
  const router = useRouter();
  const { profile } = useAuth();
  const { mutate: updateProfile } = useUpdateProfile();
  const [image, setImage] = useState<string | null>(null);

  const getImageTypeFromBase64 = (base64String: string) => {
    // Check the base64 header to determine file type
    if (base64String.startsWith('/9j/')) return 'jpg';
    if (base64String.startsWith('iVBORw0KGgo')) return 'png';
    return 'jpg'; // default fallback
  };

  const uploadImage = async () => {
    try {
      const base64Image = await FileSystem.readAsStringAsync(image, {
        encoding: "base64",
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const imageType = getImageTypeFromBase64(base64Image);
      const filePath = `${user.id}/avatar.${imageType}`;
      const contentType = `image/${imageType}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, decode(base64Image), {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;
      else return uploadData.path;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading avatar!");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmission = async () => {
    if (image) {
      try {
        console.log('Starting upload...');
        const avatarPath = await uploadImage();
        
        if (!avatarPath) {
          throw new Error('No avatar path returned from upload');
        }

        console.log('Avatar uploaded, path:', avatarPath);
        
        const updateData = {
          id: profile.id,
          username: formData.username,
          fullName: formData.fullName,
          avatar: avatarPath,
          about: formData.about,
          neighborhood: formData.neighborhood,
        };

        console.log('Updating profile with:', updateData);

        await updateProfile(updateData, {
          onSuccess: (data) => {
            console.log("Profile updated successfully:", data);
            Alert.alert(
              "Success!",
              "Your profile has been updated successfully.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    updateProfileData({});
                    router.replace("/(root)/(tabs)/home");
                  },
                },
              ]
            );
          },
          onError: (error) => {
            console.error("Update failed:", error);
            Alert.alert(
              "Error",
              "Failed to update profile. Please try again.",
              [{ text: "OK" }]
            );
          },
        });

      } catch (error) {
        console.error("Submission error:", error);
        Alert.alert(
          "Error",
          "Failed to submit profile. Please try again.",
          [{ text: "OK" }]
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 p-2">
      <View className="flex-1 justify-center">
        {/* Image Preview */}
        <View className="flex items-center justify-center mb-8">
          {image ? (
            <View className="h-64 w-64 items-center justify-center mb-16">
              <Image
                source={{ uri: image }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setImage(null)}
                className="absolute top-0 right-0 bg-black/50 p-2 rounded-full"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="h-64 w-64 items-center justify-center border-2 border-dashed border-gray-300 rounded-full mb-16">
              <FontAwesome5 name="user" size={50} color="black" />
              <Text className="text-gray-500 mt-2">No image</Text>
            </View>
          )}
        </View>

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
