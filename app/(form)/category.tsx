import { View, Image, TouchableOpacity, Text, ScrollView } from "react-native";
import { useFormContext } from "../../providers/FormProvider";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { icons } from "@/constants";

interface CategoryOption {
  id: string;
  title: string;
  image: any; // You'll import these images
}

const categories: CategoryOption[] = [
  {
    id: "1",
    title: "Crime Hotspot",
    image: icons.crimeHotspot, // Adjust path as needed
  },
  {
    id: "2",
    title: "Drainage Failure",
    image: icons.drainageFailure,
  },
  {
    id: "3",
    title: "Overpriced Grocery Shop",
    image: icons.overpricedShop,
  },
  {
    id: "4",
    title: "Illegal Road Blocking",
    image: icons.roadBlocking,
  },
  {
    id: "5",
    title: "Road Damage",
    image: icons.roadDamage,
  },
  {
    id: "6",
    title: "Accesible Toilet",
    image: icons.toilet,
  },
  {
    id: "7",
    title: "Landmark Tree",
    image: icons.tree,
  },
  {
    id: "8",
    title: "Waste Mismanagement",
    image: icons.wasteMismanagement,
  },
  {
    id: "9",
    title: "Clean Water Source",
    image: icons.waterSource,
  },
];

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
