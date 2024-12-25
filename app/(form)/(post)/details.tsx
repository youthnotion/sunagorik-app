import React from "react";
import { View } from "react-native";
import { useFormContext } from "../../../providers/PostFormProvider";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object().shape({
  description: Yup.string(),
});

export default function DetailsScreen() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormContext();
  const router = useRouter();

  const initialValues = {
    description: formData.description || "",
  };

  const handleSubmit = (values: typeof initialValues) => {
    updateFormData(values);
    router.push("/(form)/(post)/image");
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="items-center mb-6">
        <View className="bg-gray-100 rounded-full p-4">
          <MaterialIcons name="description" size={80} color="#CF322C" />
        </View>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values }) => (
          <>
            <InputField
              label={t('report.details.label')}
              value={values.description}
              onChangeText={handleChange('description')}
              placeholder={t('report.details.placeholder')}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="h-48"
            />
            
            <CustomButton 
              title={t('common.next')} 
              onPress={handleSubmit} 
              className="mt-4" 
            />
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
}