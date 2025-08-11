import React, { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { supabase } from '@/lib/supabase';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
import CustomButton from "./CustomButton";
import { icons } from "@/constants";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

const OAuth = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const handleGoogleSignIn = async () => {
      setIsLoading(true);

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(JSON.stringify(userInfo, null, 2));

            if (userInfo.data?.idToken) {
                const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                });
                // console.log(authData.session?.user.id);
                
                const { data: profileData, error: profileError } = await supabase
                  .from("profiles")
                  .select()
                  .eq("id", authData.session?.user.id)
                  .single();
          
                if (profileError) {
                  Alert.alert(profileError.message);
                  console.log(profileError);
                } else {
                  console.log(profileData);
                  router.replace("/(root)/(tabs)/home");
                }

            } else {
                Alert.alert(t('auth.signIn.error.title'), t('auth.signIn.error.generic'));
            }

      } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('sign in cancelled');
        } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('in progress');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('play services not available or outdated');
        } else {
            console.log('error', error);
        }
      } finally {
        setIsLoading(false);
      }
  }


  return (
    <View className="">

      <CustomButton
        title="   Sign In with Google"
        className=" w-full shadow-lg"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline-color"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
