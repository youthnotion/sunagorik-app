import CustomButton from "@/components/CustomButton";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link, router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import * as Yup from 'yup';
import { supabase } from "@/lib/supabase";

const validationSchema = Yup.object().shape({
  // name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain at least 8 characters, 1 letter, and 1 number'),
});

const SignUp = () => {

  const onSignUpPress = async (values: { email: string, password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    }

    else if (data) {
      Alert.alert('Success', 'Account created successfully', [{ text: 'OK', onPress: () => {
        router.replace('/(auth)/sign-in');
      } }]);
    }

  };

  return (
    <ScrollView className="flex-1 bg-white">
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
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={onSignUpPress}
          >
            {({ handleChange, handleSubmit, values, errors, touched, setFieldTouched }) => (
              <>
                {/* <InputField
                  label="Name"
                  placeholder="Enter your name"
                  icon={icons.person}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={() => setFieldTouched('name')}
                />
                <ErrorMessage error={errors.name} visible={touched.name} /> */}

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
                  onPress={handleSubmit}
                  className="mt-6"
                />
              </>
            )}
          </Formik>

          <OAuth />

          <Link
            href="/sign-in"
            className="text-md text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-sunagorik">Sign In</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
