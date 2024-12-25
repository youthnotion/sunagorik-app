import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    await i18n.changeLanguage(newLang);
    await AsyncStorage.setItem('user-language', newLang);
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <View className="w-full flex-row justify-between p-5">
        <TouchableOpacity
          onPress={toggleLanguage}
          className="flex justify-start items-start"
        >
          <Text className="text-black text-md font-JakartaBold">
            {i18n.language === 'en' ? 'বাংলা' : 'English'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.replace("/(auth)/sign-up");
          }}
          className="flex justify-end items-end"
        >
          <Text className="text-black text-md font-JakartaBold">{t('onboarding.skip')}</Text>
        </TouchableOpacity>
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#CF322C] rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item, index) => (
          <View key={item.id} className="flex items-center justify-center p-5">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10 p-2 text-center">
                {t(`onboarding.slides.${index}.title`)}
              </Text>
            </View>
            <Text className="text-lg font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
              {t(`onboarding.slides.${index}.description`)}
            </Text>
            <CustomButton
              title={isLastSlide ? t('onboarding.getStarted') : t('onboarding.next')}
              className="w-8/12 mt-10"
              onPress={() =>
                isLastSlide
                  ? router.replace("/(auth)/sign-up")
                  : swiperRef.current?.scrollBy(1)
              }
            />
          </View>
        ))}
      </Swiper>
    </SafeAreaView>
  );
};

export default Onboarding;
