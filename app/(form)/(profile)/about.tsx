import { useUpdateProfile } from "@/api/profile";
import CustomButton from "@/components/CustomButton";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import NeighborhoodDropdown from "@/components/NeighborhoodDropdown";
import ProfileProgress from "@/components/ProgressSteps";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { ProfileData, useFormContext } from "../../../providers/ProfileFormProvider";
import { useAuth } from "@/providers/AuthProvider";

const validationSchema = Yup.object().shape({
  about: Yup.string()
    .required("About is required")
    .max(240, "About must be at most 240 characters long"),
  neighborhood: Yup.string().required("Neighborhood is required"),
});

export default function FormBody() {
  const { formData, updateProfileData, resetProfile } = useFormContext();
  const router = useRouter();
  const { profile } = useAuth();
  const [isNeighborhoodValid, setIsNeighborhoodValid] = useState(true);
  const { mutate: updateProfile } = useUpdateProfile();

  const formik = useFormik({
    initialValues: {
      about: formData.about || "",
      neighborhood: formData.neighborhood || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await updateProfileData(values);
      handleSubmission();
    },
  });

  const handleSubmission = () => {
    let avatarPath;
    const randomIndex = Math.floor(Math.random() * 5);

    if (formData.gender === "male") {
      avatarPath = `random/M${randomIndex + 1}.png`;
    } else {
      avatarPath = `random/F${randomIndex + 1}.png`;
    }

    const profileData: ProfileData = {
      id: profile.id,
      username: formData.username,
      gender: formData.gender,
      about: formik.values.about,
      neighborhood: formik.values.neighborhood,
    };

    console.log(profileData);

    updateProfile(profileData, {
      onSuccess: (data) => {
        Alert.alert(
          "Success!",
          "Your profile has been updated successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                resetProfile();
                router.replace("/(root)/(tabs)/home");
              },
            },
          ]
        );
      },
      onError: (error) => {
        console.error("Update failed:", error);
        Alert.alert(
          "Error",
          "Failed to update profile. Please try again. Error: " + error.message,
          [{ text: "OK" }]
        );
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
      <ProfileProgress currentStep={2} totalSteps={2} />
      <View className="items-center mt-12 mb-8">
          <View className="bg-gray-100 p-6 rounded-full">
            <FontAwesome name="user-circle-o" size={80} color="#CF322C" />
          </View>
        </View>

        <View>
          <NeighborhoodDropdown
            value={formik.values.neighborhood}
            onChangeValue={(value) =>
              formik.setFieldValue("neighborhood", value)
            }
            error={formik.errors.neighborhood}
            touched={formik.touched.neighborhood}
            onBlur={() => formik.setFieldTouched("neighborhood")}
            onValidationChange={setIsNeighborhoodValid}
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
            inputStyle="h-32"
          />
          <ErrorMessage
            error={formik.errors.about}
            visible={formik.touched.about}
          />
        </View>

        <CustomButton
          title="Submit"
          onPress={formik.handleSubmit}
          disabled={!formik.isValid || !formik.dirty || !isNeighborhoodValid}
          className={`mt-8 ${
            formik.isValid && formik.dirty && isNeighborhoodValid ? "bg-sunagorik" : "bg-gray-300"
          } p-4 rounded-lg`}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
