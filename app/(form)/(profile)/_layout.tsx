import { Stack, useRouter } from "expo-router";
import { FormProvider } from "../../../providers/ProfileFormProvider";
import { TouchableOpacity, Text } from "react-native";

const Layout = () => {
  const router = useRouter();

  return (
    <FormProvider>
      <Stack>
        <Stack.Screen
          name="body"
          options={{ title: "Profile", headerShown: false }}
        />
        <Stack.Screen
          name="about"
          options={{ title: "About", headerShown: false }}
        />
        <Stack.Screen
          name="avatar"
          options={{
            title: "Update Avatar",
            headerShown: true,
            headerBackVisible: false,
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.replace("/(root)/(tabs)/profile")}
              >
                <Text className="font-semibold text-lg mr-2">Cancel</Text>
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </FormProvider>
  );
};

export default Layout;
