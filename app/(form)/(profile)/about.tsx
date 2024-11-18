import { useRouter } from "expo-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormContext } from "../../../providers/ProfileFormProvider";
import NeighborhoodDropdown from "@/components/NeighborhoodDropdown";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import ErrorMessage from "@/components/ErrorMessage";
import { FontAwesome } from "@expo/vector-icons";

const validationSchema = Yup.object().shape({
  about: Yup.string()
    .required("About is required")
    .max(240, "About must be at most 240 characters long"),
  neighborhood: Yup.string().required("Neighborhood is required"),
});

export default function FormBody() {
  const { formData, updateProfileData } = useFormContext();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      about: formData.about || "",
      neighborhood: formData.neighborhood || "",
    },
    validationSchema,
    onSubmit: (values) => {
      updateProfileData(values);
      router.push("/(form)/(profile)/avatar");
    },
  });

  return (
    <SafeAreaView className="flex-1 px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
      <View className="items-center mb-2">
          <View className="bg-gray-100 p-6 rounded-full">
            <FontAwesome name="user-circle-o" size={80} color="#CF322C" />
          </View>
        </View>

        <View className="mb-2">
          <NeighborhoodDropdown
            value={formik.values.neighborhood}
            onChangeValue={(value) =>
              formik.setFieldValue("neighborhood", value)
            }
            error={formik.errors.neighborhood}
            touched={formik.touched.neighborhood}
            onBlur={() => formik.setFieldTouched("neighborhood")}
          />
        </View>

        <View className="mb-4">
          <InputField
            label="About"
            value={formik.values.about}
            onChangeText={formik.handleChange("about")}
            onBlur={formik.handleBlur("about")}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="h-36"
          />
          <ErrorMessage
            error={formik.errors.about}
            visible={formik.touched.about}
          />
        </View>

        <CustomButton
          title="Next"
          onPress={formik.handleSubmit}
          disabled={!formik.isValid || !formik.dirty}
          className={`mt-4 ${
            formik.isValid && formik.dirty ? "bg-sunagorik" : "bg-gray-300"
          }`}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
