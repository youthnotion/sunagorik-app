import { Stack } from "expo-router";
import { FormProvider } from "../../../providers/ProfileFormProvider";

const Layout = () => {
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
          options={{ title: "Avatar", headerShown: true }}
        />
      </Stack>
    </FormProvider>
  );
};

export default Layout;
