import { animations } from "@/constants";
import LottieView from "lottie-react-native";
import React from "react";

const ActivityIndicator = ({ visible = false }) => {
  if (!visible) return null;

  return
    <LottieView
      source={animations.loading}
      autoPlay
      loop
    />
};

export default ActivityIndicator;
