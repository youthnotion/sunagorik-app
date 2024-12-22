import { Stack, useRouter } from "expo-router";
import { FormProvider } from "../../../providers/PostFormProvider";
import { TouchableOpacity, Text } from "react-native";

const Layout = () => {
  const router = useRouter();

  return (
    <FormProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.replace("/(root)/(tabs)/home")}
            >
              <Text className="font-semibold text-lg mr-2">Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen
          name="category"
          options={{
            title: "Category",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="body"
          options={{
            title: "Your Report",
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            title: "Description",
          }}
        />
        <Stack.Screen
          name="image"
          options={{
            title: "Upload Image",
          }}
        />
      </Stack>
    </FormProvider>
  );
};

export default Layout;
