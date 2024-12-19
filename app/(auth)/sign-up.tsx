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

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number')
    .matches(/^[A-Za-z0-9!@#$%^&*(),.?_\-+=]*$/, 'Invalid special character. Only ! @ # $ % ^ & * ( ) , . ? _ - + = are allowed'),
});

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onSignUpPress = async (values: { email: string, password: string }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      Alert.alert('Success', 'Account created successfully. Please check your email to verify your account', [{ 
        text: 'OK', 
        onPress: () => {
          router.replace('/(auth)/sign-in');
        } 
      }]);
      
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
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
                    Create Your Account
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
                      label="Email"
                      placeholder="Enter your email"
                      icon={icons.email}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={() => setFieldTouched('email')}
                    />
                    <ErrorMessage error={errors.email} visible={touched.email} />

                    <InputField
                      label="Password"
                      placeholder="Enter your password"
                      icon={icons.lock}
                      secureTextEntry={true}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={() => setFieldTouched('password')}
                    />
                    <ErrorMessage error={errors.password} visible={touched.password} />
                    <CustomButton
                      title="Sign Up"
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
                <Text className="text-md text-general-200">Already have an account? </Text>
                <Text className="text-md text-sunagorik">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignUp;
