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

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters long'),
  fullName: Yup.string().required('Full name is required').min(10, 'Full name must be at least 10 characters long'),
});

export default function FormBody() {
  const { formData, updateProfileData } = useFormContext();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: formData.username || '',
      fullName: formData.fullName || '',
    },
    validationSchema,
    onSubmit: (values) => {
      updateProfileData(values);
      router.push("/(form)/(profile)/about");
    },
  });

  return (
    <SafeAreaView className="flex-1 p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
      <View className="items-center mb-2">
        <View className="bg-gray-100 p-6 rounded-full">
          <FontAwesome name="user-circle-o" size={80} color="#CF322C" />
        </View>
      </View>

      <View>
        <InputField
          value={formik.values.username}
          label="Username"
          onChangeText={formik.handleChange('username')}
          onBlur={formik.handleBlur('username')}
          placeholder="Enter username"
        />
        <ErrorMessage error={formik.errors.username} visible={formik.touched.username} />
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

      <CustomButton
        title="Next"
        onPress={formik.handleSubmit}
        disabled={!formik.isValid || !formik.dirty}
        className={`mt-8 p-4 rounded-lg ${
          formik.isValid && formik.dirty ? "bg-sunagorik" : "bg-gray-300"
        }`}
      />
      </ScrollView>
    </SafeAreaView>
  );
}
