import OAuth from "@/components/OAuth";
import { images } from "@/constants";
import React from "react";
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const { t } = useTranslation();

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          <Image 
            source={images.signin} 
            className="absolute w-full h-full"
            resizeMode="cover"
          />
          <View className="flex-1 justify-end pb-8 px-4">
            <View className="bg-gray-100/95 p-2 rounded-lg">
              <OAuth />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SignUp;
