import CustomButton from "@/components/CustomButton";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must contain at least 8 characters, 1 letter, and 1 number"
    ),
});

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const onSignInPress = () => {};

  return (
    <ScrollView className="flex-1 bg-white">
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
          {/* <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome
          </Text> */}
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
                  onPress={onSignInPress}
                  className="mt-6"
                />
              </>
            )}
          </Formik>

          <OAuth />

          <Link
            href="/sign-up"
            className="text-md text-center text-general-200 mt-10"
          >
            <Text>Don't have an account? </Text>
            <Text className="text-sunagorik">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
