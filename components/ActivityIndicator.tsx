import LottieView from "lottie-react-native";
import { View } from "react-native";
import { animations } from "@/constants";

export default function ActivityIndicator({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <View className="absolute inset-0 w-full h-full bg-gray-200/90 items-center justify-center z-50">
      <LottieView
        source={animations.loader}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}