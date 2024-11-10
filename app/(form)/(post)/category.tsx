import { categories } from "@/constants";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFormContext } from "../../../providers/PostFormProvider";


export default function Category() {
  const { updateFormData } = useFormContext();
  const router = useRouter();

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
