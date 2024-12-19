import { View } from "react-native";

type ProfileProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export default function ProfileProgress({ currentStep, totalSteps }: ProfileProgressProps) {
  return (
    <View className="flex-row justify-between items-center w-full px-24 py-8">
      <View className="flex-row gap-3 w-full">
        {[...Array(totalSteps)].map((_, index) => (
          <View
            key={index}
            className={`flex-1 h-2 rounded-full ${
              currentStep >= index + 1 ? "bg-sunagorik" : "bg-general-100"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
