import CustomButton from "@/components/CustomButton";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import NeighborhoodDropdown from "@/components/NeighborhoodDropdown";
import StarRating from "@/components/StarRating";
import { neighborhoods } from "@/constants";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import { Formik } from 'formik';
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from 'yup';
import { useFormContext } from "../../../providers/PostFormProvider";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('Title is required')
    .min(10, 'Title must be at least 10 characters')
    .max(240, 'Title must be less than 240 characters'),
  neighborhood: Yup.string().required('Neighborhood is required'),
  description: Yup.string(),
  severity: Yup.number()
    .min(1, 'Please select severity')
    .required('Severity is required'),
});

export default function FormBody() {
  const { formData, updateFormData } = useFormContext();
  const router = useRouter();

  const initialValues = {
    title: formData.title || "",
    neighborhood: formData.neighborhood || "",
    description: formData.description || "",
    severity: formData.severity || 0,
  };

  const handleSubmit = (values: typeof initialValues) => {
    updateFormData(values);
    router.push("/(form)/(post)/details");
  };

  return (
    <SafeAreaView className="flex-1 px-4">
    <View className="items-center">
        <View className="bg-gray-100 rounded-full">
        <MaterialIcons name="post-add" size={80} color="#CF322C" />
        </View>
      </View>      

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values, errors, touched, setFieldTouched, setFieldValue }) => (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <View className="mb-2">
              <InputField
                label="Title"
                value={values.title}
                onChangeText={handleChange('title')}
                placeholder="Write a caption for your post"
                onBlur={() => setFieldTouched('title')}
              />
              <ErrorMessage error={errors.title} visible={touched.title} />
            </View>

            {/* Neighborhood Input */}
            <View className="mb-2">
              <NeighborhoodDropdown
                value={values.neighborhood}
                onChangeValue={(value) => setFieldValue('neighborhood', value)}
                error={errors.neighborhood}
                touched={touched.neighborhood}
                onBlur={() => setFieldTouched('neighborhood')}
              />
            </View>

            {/* Severity */}
            <Text className="text-black text-lg mb-2 font-medium">Severity</Text>
            <View className="justify-center items-center bg-white p-8 rounded-lg border border-gray-200">
              <StarRating 
                rating={values.severity}
                size={40}
                onRatingChange={(rating) => handleChange('severity')(rating.toString())}
              />
            </View>
            <ErrorMessage error={errors.severity} visible={touched.severity} />

            {/* Submit Button */}
            <CustomButton title="Next" onPress={handleSubmit} className="mt-8" />
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
}