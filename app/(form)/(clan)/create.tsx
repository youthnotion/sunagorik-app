import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import { Formik, FormikProps } from 'formik';
import React, { useState, useRef } from "react";
import { ScrollView, Text, View, Alert, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from 'yup';
import { useFormContext } from "../../../providers/ClanCreateFormProvider";
import { useTranslation } from 'react-i18next';
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import { useCreateClan } from "@/hooks/clanHooks";
import { Ionicons } from "@expo/vector-icons";



export default function Create() {
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormContext();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createClan } = useCreateClan();
  const formikRef = useRef<FormikProps<typeof initialValues>>(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t('A Name is required'))
      .min(8, t('Name must be at least 8 characters'))
      .max(50, t('Name can be at most 50 characters')),
    description: Yup.string()
      .required(t('A Description is required'))
      .min(50, t('Description must be at least 50 characters'))
      .max(500, t('Description can be at most 500 characters')),
  });

  const initialValues = {
    name: formData.name || "",
    description: formData.description || "",
    logo_url: formData.logo_url || null,
  };

  const getImageTypeFromBase64 = (base64String: string) => {
    if (base64String.startsWith("/9j/")) return "jpg";
    if (base64String.startsWith("iVBORw0KGgo")) return "png";
    return "jpg";
  };

  const uploadImage = async () => {
    try {
      if (!image) throw new Error("No image selected");
      const base64Image = await FileSystem.readAsStringAsync(image, {
        encoding: "base64",
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user! Please Sign In.");

      const imageType = getImageTypeFromBase64(base64Image);
      const filePath = `${randomUUID()}.${imageType}`;
      const contentType = `image/${imageType}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("clan-logos")
        .upload(filePath, decode(base64Image), {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;
      else return uploadData.path;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t('report.image.uploadError'));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (image) {
      try {
        setIsSubmitting(true);
        console.log("Starting upload...");
        const imagePath = await uploadImage();

        if (!imagePath) {
          throw new Error("Please Upload your clan Logo!");
        }

        console.log("Image uploaded, path:", imagePath);

        const createData = {
          name: formData.name,
          description: formData.description,
          logo_url: imagePath,
        };

        console.log("Creating Clan with:", createData);
        const data = await createClan(createData);
        setIsSubmitting(false);
        console.log("Clan created successfully:", data);
        Alert.alert(
          t('Clan Created Successfully!'),
          t('Your clan has been created successfully.'),
          [
            {
              text: t('common.ok'),
              onPress: () => {
                updateFormData({});
                router.replace("/(root)/(tabs)/clan");
              },
            },
          ]
        );
      } catch (error) {
        setIsSubmitting(false);
        console.error("Submission error:", error);
        Alert.alert(
          t('report.image.error.title'),
          t('report.image.error.message'),
          [{ text: t('common.ok') }]
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 px-4">
      <ScrollView className="flex-1 ">
        <View className="items-center">
          <View className="bg-gray-100 rounded-full">
            <MaterialIcons name="post-add" size={80} color="#CF322C" />
          </View>
        </View>      

        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <View className=" mb-4">
              {/* Title Input */}
              <View className="mb-2">
                <InputField
                  label={t('Clan Name')}
                  value={formData.name}
                  onChangeText={(text) => updateFormData({ name: text })}
                  placeholder={t('Your Clan Name')}
                />
                <ErrorMessage error={errors.name} visible={touched.name} />
              </View>

              <View className="mb-2">
                <InputField
                  label={t('Clan Description')}
                  value={formData.description}
                  onChangeText={(text) => updateFormData({ description: text })}
                  placeholder={t('Describe Your Clan...')}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="h-48"
                />
                <ErrorMessage error={errors.description} visible={touched.description} />
              </View>
            </View>
          )}
        </Formik>
        <View className=" flex justify-center items-center">
          {image && (
            <View className="h-[100px] w-[100px] items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mb-4">
              <Image
                source={{ uri: image }}
                className="w-full h-full rounded-lg"
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={() => setImage(null)}
                className="absolute top-0 right-0 bg-black/50 p-2 rounded-full"
              >
                <Ionicons name="close" size={15} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="flex-row gap-4 mb-4">
          <TouchableOpacity
            onPress={pickImage}
            className="flex-1 flex-row items-center justify-center bg-sunagorik p-4 rounded-lg"
          >
            <Ionicons name="images" size={24} color="white" className="mr-2" />
            <Text className="text-white font-semibold ml-2">{t('Select Logo')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => formikRef.current?.submitForm()}
          disabled={!image || isSubmitting}
          className={`p-4 rounded-lg border-2 border-sunagorik ${
            image ? !isSubmitting ? "bg-sunagorik" : "bg-gray-300" : "bg-red-300"
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {t('Create')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}