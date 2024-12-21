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

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number')
    .matches(/^[A-Za-z0-9!@#$%^&*(),.?_\-+=]*$/, 'Invalid special character. Only ! @ # $ % ^ & * ( ) , . ? _ - + = are allowed'),
});

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

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
            "Email Not Verified",
            "Would you like to resend the verification email?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "Resend",
                onPress: async () => {
                  const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email: values.email,
                  });
                  if (error) {
                    Alert.alert("Error", error.message);
                  } else {
                    Alert.alert("Success", "Verification email sent! Please check your inbox.");
                  }
                }
              }
            ]
          );
        } else {
          Alert.alert("Error", authError.message);
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
      Alert.alert("Error", "An unexpected error occurred");
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
                    Welcome
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
                      label="Email"
                      placeholder="Enter your email"
                      keyboardType="email-address"
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
                      title="Sign In"
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
                <Text className="text-md text-general-200">Don't have an account? </Text>
                <Text className="text-md text-sunagorik">Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignIn;
