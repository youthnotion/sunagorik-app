import ActivityIndicator from "@/components/ActivityIndicator";
import CustomButton from "@/components/CustomButton";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { supabase } from "@/lib/supabase";
import { Link, router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { useTranslation } from 'react-i18next';

const SignIn = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('auth.signIn.email.validation.invalid'))
      .required(t('auth.signIn.email.validation.required')),
    password: Yup.string()
      .required(t('auth.signIn.password.validation.required'))
      .min(8, t('auth.signIn.password.validation.minLength'))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('auth.signIn.password.validation.complexity'))
      .matches(/^[A-Za-z0-9!@#$%^&*(),.?_\-+=]*$/, t('auth.signIn.password.validation.specialChars')),
  });

  const onSignInPress = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

      if (authError) {
        if (authError.message.toLowerCase().includes('email not confirmed')) {
          Alert.alert(
            t('auth.signIn.emailVerification.title'),
            t('auth.signIn.emailVerification.message'),
            [
              {
                text: t('auth.signIn.emailVerification.cancel'),
                style: "cancel"
              },
              {
                text: t('auth.signIn.emailVerification.resend'),
                onPress: async () => {
                  const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email: values.email,
                  });
                  if (error) {
                    Alert.alert(t('auth.signIn.error.title'), error.message);
                  } else {
                    Alert.alert(t('auth.signIn.error.title'), t('auth.signIn.emailVerification.success'));
                  }
                }
              }
            ]
          );
        } else {
          Alert.alert(t('auth.signIn.error.title'), authError.message);
        }
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select()
        .eq("id", authData.user?.id)
        .single();

      if (profileError) {
        Alert.alert(profileError.message);
      }
      else if (profileData.username === null) {
        console.log(profileError);
        router.replace("/(form)/(profile)/body");
      } else {
        console.log(profileData);
        router.replace("/(root)/(tabs)/home");
      }

    } catch (error) {
      Alert.alert(t('auth.signIn.error.title'), t('auth.signIn.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      {isLoading && <ActivityIndicator visible={isLoading} />}
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1" pointerEvents={isLoading ? "none" : "auto"}>
          <View className="flex-1 bg-white">
            <View className="relative w-full h-[250px]">
              <Image source={images.signup} className="z-0 w-full h-[250px]" />
              <View className="absolute bottom-5 left-5">
                <View className=" bg-gray-100/70 px-4 py-2 rounded-lg">
                  <Text className="text-2xl text-black font-JakartaSemiBold">
                    {t('auth.signIn.welcome')}
                  </Text>
                </View>
              </View>
            </View>

            <View className="p-5">
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={onSignInPress}
              >
                {({
                  handleChange,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldTouched,
                  isValid,
                  dirty
                }) => (
                  <>
                    <InputField
                      label={t('auth.signIn.email.label')}
                      placeholder={t('auth.signIn.email.placeholder')}
                      keyboardType="email-address"
                      icon={icons.email}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={() => setFieldTouched('email')}
                    />
                    <ErrorMessage error={errors.email} visible={touched.email} />
                    <InputField
                      label={t('auth.signIn.password.label')}
                      placeholder={t('auth.signIn.password.placeholder')}
                      icon={icons.lock}
                      secureTextEntry={true}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={() => setFieldTouched('password')}
                    />
                    <ErrorMessage error={errors.password} visible={touched.password} />
                    <CustomButton
                      title={t('auth.signIn.button')}
                      bgVariant={(!isValid || !dirty) ? "secondary" : "primary"}
                      onPress={handleSubmit}
                      className="mt-6"
                      disabled={!isValid || !dirty || isLoading}
                    />
                  </>
                )}
              </Formik>

              <OAuth />

              <Pressable
                onPress={() => router.replace("/sign-up")}
                className="flex-row justify-center items-center mt-10"
              >
                <Text className="text-md text-general-200">{t('auth.signIn.noAccount')}</Text>
                <Text className="text-md text-sunagorik">{t('auth.signIn.signUp')}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignIn;
