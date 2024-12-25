import { View, Text, TouchableOpacity, Image } from "react-native";
import { useFormContext } from "../../../providers/PostFormProvider";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { useCreatePost } from "@/api/post/index";
import { useAuth } from "@/providers/AuthProvider";
import ActivityIndicator from "@/components/ActivityIndicator";
import { useTranslation } from 'react-i18next';

export default function ImageUpload() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { formData, updateFormData } = useFormContext();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { mutate: createPost } = useCreatePost();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            t('report.image.locationPermission.title'),
            t('report.image.locationPermission.message')
          );
          return;
        }

        const position = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation(newLocation);
        updateFormData({ location: newLocation });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    requestLocation();
  }, []);

  const getImageTypeFromBase64 = (base64String: string) => {
    if (base64String.startsWith("/9j/")) return "jpg";
    if (base64String.startsWith("iVBORw0KGgo")) return "png";
    return "jpg";
  };

  const uploadImage = async () => {
    try {
      if (!image) throw new Error("No image selected");
      const base64Image = await FileSystem.readAsStringAsync(image, {
        encoding: "base64",
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const imageType = getImageTypeFromBase64(base64Image);
      const filePath = `${randomUUID()}.${imageType}`;
      const contentType = `image/${imageType}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("posts")
        .upload(filePath, decode(base64Image), {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;
      else return uploadData.path;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t('report.image.uploadError'));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.3,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert(t('report.image.cameraPermission.message'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmission = async () => {
    if (image && location) {
      try {
        setIsSubmitting(true);
        console.log("Starting upload...");
        const imagePath = await uploadImage();

        if (!imagePath) {
          throw new Error("No avatar path returned from upload");
        }

        console.log("Image uploaded, path:", imagePath);

        const createData = {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          image: imagePath,
          location: location,
          neighborhood: formData.neighborhood,
          severity_score: formData.severity,
          reported_by: profile?.id,
        };

        console.log("Creating post with:", createData);

        await createPost(createData, {
          onSuccess: (data) => {
            setIsSubmitting(false);
            console.log("Post created successfully:", data);
            Alert.alert(
              t('report.image.success.title'),
              t('report.image.success.message'),
              [
                {
                  text: t('common.ok'),
                  onPress: () => {
                    updateFormData({});
                    router.replace("/(root)/(tabs)/feed");
                  },
                },
              ]
            );
          },
          onError: (error) => {
            setIsSubmitting(false);
            console.error("Post creation failed:", error);
            Alert.alert(
              t('report.image.error.title'),
              t('report.image.error.message'),
              [{ text: t('common.ok') }]
            );
          },
        });
      } catch (error) {
        setIsSubmitting(false);
        console.error("Submission error:", error);
        Alert.alert(
          t('report.image.error.title'),
          t('report.image.error.message'),
          [{ text: t('common.ok') }]
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 p-2">
      <View className="flex-1">
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
            <Text className="text-gray-500 mt-2">{t('report.image.noImage')}</Text>
          </View>
        )}

        <View className="flex-row gap-4 mb-4">
          <TouchableOpacity
            onPress={takePhoto}
            className="flex-1 flex-row items-center justify-center bg-sunagorik p-4 rounded-lg"
          >
            <Ionicons name="camera" size={24} color="white" className="mr-2" />
            <Text className="text-white font-semibold ml-2">{t('report.image.takePhoto')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickImage}
            className="flex-1 flex-row items-center justify-center bg-sunagorik p-4 rounded-lg"
          >
            <Ionicons name="images" size={24} color="white" className="mr-2" />
            <Text className="text-white font-semibold ml-2">{t('report.image.gallery')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSubmission}
          disabled={!image || isSubmitting}
          className={`p-4 rounded-lg ${
            image && !isSubmitting ? "bg-sunagorik" : "bg-gray-300"
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {t('report.image.submit')}
          </Text>
        </TouchableOpacity>
        {<ActivityIndicator visible={isSubmitting} />}
      </View>
    </SafeAreaView>
  );
}
