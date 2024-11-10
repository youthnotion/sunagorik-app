import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useFormContext } from "../../../providers/PostFormProvider";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from "@/components/StarRating";
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from "@/components/ErrorMessage";
import CustomButton from "@/components/CustomButton";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('Title is required')
    .min(10, 'Title must be at least 10 characters')
    .max(240, 'Title must be less than 240 characters'),
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
    description: formData.description || "",
    severity: formData.severity || 0,
  };

  const handleSubmit = (values: typeof initialValues) => {
    updateFormData(values);
    router.push("/(form)/image");
  };

  return (
    <SafeAreaView className="flex-1 p-2">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values, errors, touched, setFieldTouched }) => (
          <>
            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-gray-700 text-base mb-2 font-medium">Title</Text>
              <TextInput
                value={values.title}
                onChangeText={handleChange('title')}
                placeholder="Enter title"
                onBlur={() => setFieldTouched('title')}
                className={`w-full bg-white p-4 rounded-lg border ${
                  touched.title && errors.title ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              <ErrorMessage error={errors.title} visible={touched.title} />
            </View>

            {/* Details Input */}
            <View className="mb-4">
              <Text className="text-gray-700 text-base mb-2 font-medium">Details</Text>
              <TextInput
                value={values.description}
                onChangeText={handleChange('description')}
                placeholder="Enter details (optional)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="w-full bg-white p-4 rounded-lg border border-gray-200 h-32"
              />
            </View>

            {/* Severity */}
            <Text className="text-gray-700 text-base mb-2 font-medium">Severity</Text>
            <View className="justify-center items-center bg-white p-8 rounded-lg border border-gray-200">
              <StarRating 
                rating={values.severity}
                size={40}
                onRatingChange={(rating) => handleChange('severity')(rating.toString())}
              />
            </View>
            <ErrorMessage error={errors.severity} visible={touched.severity} />

            {/* Submit Button */}
            <CustomButton title="Next" onPress={handleSubmit} className="mt-6" />
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
}