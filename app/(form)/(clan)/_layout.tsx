import { Stack, useRouter } from "expo-router";
import { FormProvider } from "../../../providers/ClanCreateFormProvider";
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
              onPress={() => router.replace("/(root)/(tabs)/clan")}
            >
              <Text className="font-semibold text-lg mr-2">Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen
          name="create"
          options={{
            title: "Create Clan",
            headerBackVisible: false,
          }}
        />
      </Stack>
    </FormProvider>
  );
};

export default Layout;
