import { useRouter } from "expo-router";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormContext } from "../../../providers/ProfileFormProvider";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import ErrorMessage from "@/components/ErrorMessage";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import debounce from 'lodash/debounce';
import ProfileProgress from "@/components/ProgressSteps";
import GenderSelect from "@/components/GenderSelect";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .test('unique', 'Username is already taken', () => true), 
  fullName: Yup.string()
    .required('Full name is required')
    .min(10, 'Full name must be at least 10 characters long'),
  gender: Yup.string()
    .required('Please select your gender')
    .oneOf(['male', 'female', 'other'], 'Invalid gender selection'),
});

export default function FormBody() {
  const { formData, updateProfileData } = useFormContext();
  const router = useRouter();
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) return;
    
    setIsCheckingUsername(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking username:', error);
        return;
      }

      if (data) {
        setUsernameError('Username is already taken');
      } else {
        setUsernameError(null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const debouncedCheckUsername = debounce(checkUsernameAvailability, 1000);

  useEffect(() => {
    return () => {
      debouncedCheckUsername.cancel();
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      username: formData.username || '',
      fullName: formData.fullName || '',
      gender: formData.gender || '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const isValid = await formik.validateForm();
        if (Object.keys(isValid).length === 0) {
          await updateProfileData(values);
          router.push("/(form)/(profile)/about");
        }
      } catch (error) {
        console.error('Validation error:', error);
      }
    },
  });

  const handleUsernameChange = (text: string) => {
    formik.handleChange('username')(text);
    if (text.length >= 3) {
      debouncedCheckUsername(text);
    } else {
      setUsernameError(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView className="flex-1">
      <ProfileProgress currentStep={1} totalSteps={2} />
        <View className="items-center mt-12 mb-8">
          <View className="bg-gray-100 p-6 rounded-full">
            <FontAwesome name="user-circle-o" size={80} color="#CF322C" />
          </View>
        </View>

        <View>
          <InputField
            value={formik.values.username}
            label="Username"
            onChangeText={handleUsernameChange}
            onBlur={formik.handleBlur('username')}
            placeholder="Enter username"
          />
          <ErrorMessage 
            error={usernameError || formik.errors.username} 
            visible={isCheckingUsername || formik.touched.username} 
          />
        </View>

        <View>
          <InputField
            value={formik.values.fullName}
            label="Full Name"
            onChangeText={formik.handleChange('fullName')}
            onBlur={formik.handleBlur('fullName')}
            placeholder="Enter full name"
          />
          <ErrorMessage error={formik.errors.fullName} visible={formik.touched.fullName} />
        </View>

        <View className="mb-4">
            <GenderSelect
              value={formik.values.gender}
              onChangeValue={(value) => {
                formik.setFieldValue('gender', value);
              }}
            />
          </View>

        <CustomButton
          title="Next"
          onPress={formik.handleSubmit}
          disabled={!formik.values.username || !formik.values.fullName || !formik.values.gender || isCheckingUsername || !!usernameError}
          className={`mt-8 p-4 rounded-lg ${
            formik.values.username && formik.values.fullName && formik.values.gender && !isCheckingUsername && !usernameError ? "bg-sunagorik" : "bg-gray-300"
          }`}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
