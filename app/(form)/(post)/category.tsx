import { categories } from "@/constants";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFormContext } from "../../../providers/PostFormProvider";
import * as Location from "expo-location";
import { useEffect } from "react";

export default function Category() {
  const { updateFormData } = useFormContext();
  const router = useRouter();

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to post your report",
            [
              { text: "OK", onPress: () => router.replace("/(tabs)/home") }
            ]
          );
          return;
        }

        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services in your device settings to post your report",
            [
              { text: "OK", onPress: () => router.replace("/(tabs)/home") }
            ]
          );
          return;
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Unable to access location services",
          [
            { text: "OK", onPress: () => router.replace("/(tabs)/home") }
          ]
        );
      }
    };

    checkLocationPermission();
  }, []);

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4 flex-row flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className="w-[45%] bg-white rounded-lg p-3 items-center shadow-sm"
            onPress={() => {
              updateFormData({ category: category.title });
              router.push("/(form)/body");
            }}
          >
            <Image
              source={category.image}
              className="w-20 h-20 rounded-lg mb-2"
            />
            <Text className="text-base font-JakartaSemiBold text-gray-800 text-center">
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
