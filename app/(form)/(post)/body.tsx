import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useFormContext } from "../../../providers/PostFormProvider";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from "@/components/StarRating";
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from "@/components/ErrorMessage";
import CustomButton from "@/components/CustomButton";
import { neighborhoods } from "@/constants";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const initialValues = {
    title: formData.title || "",
    neighborhood: formData.neighborhood || "",
    description: formData.description || "",
    severity: formData.severity || 0,
  };

  const filteredNeighborhoods = neighborhoods.filter(n => 
    n.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {({ handleChange, handleSubmit, values, errors, touched, setFieldTouched, setFieldValue }) => (
          <ScrollView>
            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-gray-700 text-base mb-2 font-medium">Title</Text>
              <TextInput
                value={values.title}
                onChangeText={handleChange('title')}
                placeholder="Write a caption for your post"
                onBlur={() => setFieldTouched('title')}
                className={`w-full bg-white p-4 rounded-lg border border-gray-200 focus:border-sunagorik`}
              />
              <ErrorMessage error={errors.title} visible={touched.title} />
            </View>

            {/* Neighborhood Input */}
            <View className="mb-4">
              <Text className="text-gray-700 text-base mb-2 font-medium">Neighborhood</Text>
              <View className="relative">
                <TextInput
                  value={values.neighborhood}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    setFieldValue('neighborhood', text);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Start typing the name of your area"
                  onBlur={() => {
                    setFieldTouched('neighborhood');
                    setTimeout(() => setShowDropdown(false), 200);
                  }}
                  className={`w-full bg-white p-4 rounded-lg border border-gray-200 focus:border-sunagorik`}
                />
                
                {/* Dropdown List */}
                {showDropdown && filteredNeighborhoods.length > 0 && (
                  <View className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-48">
                    <ScrollView 
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled={true}
                    >
                      {filteredNeighborhoods.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          className="p-4 border-b border-gray-100"
                          onPress={() => {
                            setFieldValue('neighborhood', item.en);
                            setSearchQuery(item.en);
                            setShowDropdown(false);
                          }}
                        >
                          <Text>{item.en}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
              <ErrorMessage error={errors.neighborhood} visible={touched.neighborhood} />
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
                className="w-full bg-white p-4 rounded-lg border border-gray-200 h-32 focus:border-sunagorik"
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
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
}