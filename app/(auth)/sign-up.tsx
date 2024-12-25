import CustomButton from "@/components/CustomButton";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link, router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { Alert, Image, Pressable, ScrollView, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from 'yup';
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import ActivityIndicator from "@/components/ActivityIndicator";
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('auth.signUp.email.validation.invalid'))
      .required(t('auth.signUp.email.validation.required')),
    password: Yup.string()
      .required(t('auth.signUp.password.validation.required'))
      .min(8, t('auth.signUp.password.validation.minLength'))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('auth.signUp.password.validation.complexity'))
      .matches(/^[A-Za-z0-9!@#$%^&*(),.?_\-+=]*$/, t('auth.signUp.password.validation.specialChars')),
  });

  const onSignUpPress = async (values: { email: string, password: string }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        Alert.alert(t('auth.signUp.error.title'), error.message);
        return;
      }

      Alert.alert(t('auth.signUp.success.title'), t('auth.signUp.success.message'), [{ 
        text: 'OK', 
        onPress: () => {
          router.replace('/(auth)/sign-in');
        } 
      }]);
      
    } catch (error) {
      Alert.alert(t('auth.signUp.error.title'), t('auth.signUp.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      {isLoading && <ActivityIndicator visible={isLoading} />}
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1" pointerEvents={isLoading ? "none" : "auto"}>
          <View className="flex-1 bg-white">
            <View className="relative w-full h-[250px]">
              <Image source={images.signup} className="z-0 w-full h-[250px]" />
              <View className="absolute bottom-5 left-5">
                <View className=" bg-gray-100/70 px-4 py-2 rounded-lg">
                  <Text className="text-2xl text-black font-JakartaSemiBold">
                    {t('auth.signUp.welcome')}
                  </Text>
                </View>
              </View>
            </View>

            <View className="p-5">
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={onSignUpPress}
              >
                {({ handleChange, handleSubmit, values, errors, touched, setFieldTouched, isValid, dirty }) => (
                  <>
                    <InputField
                      label={t('auth.signUp.email.label')}
                      placeholder={t('auth.signUp.email.placeholder')}
                      keyboardType="email-address"
                      icon={icons.email}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={() => setFieldTouched('email')}
                    />
                    <ErrorMessage error={errors.email} visible={touched.email} />

                    <InputField
                      label={t('auth.signUp.password.label')}
                      placeholder={t('auth.signUp.password.placeholder')}
                      icon={icons.lock}
                      secureTextEntry={true}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={() => setFieldTouched('password')}
                    />
                    <ErrorMessage error={errors.password} visible={touched.password} />
                    <CustomButton
                      title={t('auth.signUp.button')}
                      bgVariant={(!isValid || !dirty) ? "secondary" : "primary"}
                      onPress={handleSubmit}
                      className="mt-6"
                      disabled={!isValid || !dirty}
                    />
                  </>
                )}
              </Formik>

              <OAuth />

              <Pressable
                onPress={() => router.replace("/sign-in")}
                className="flex-row justify-center items-center mt-10"
              >
                <Text className="text-md text-general-200">{t('auth.signUp.haveAccount')}</Text>
                <Text className="text-md text-sunagorik">{t('auth.signUp.signIn')}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignUp;
