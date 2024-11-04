import { Stack } from "expo-router";
import { FormProvider } from "../../../providers/PostFormProvider";

const Layout = () => {
  return (
    <FormProvider>
      <Stack>
        <Stack.Screen
          name="category"
          options={{ title: "Category", headerShown: true }}
        />
        <Stack.Screen
          name="body"
          options={{ title: "Your Report", headerShown: true }}
        />
        <Stack.Screen
          name="image"
          options={{ title: "Upload Image", headerShown: true }}
        />
      </Stack>
    </FormProvider>
  );
};

export default Layout;
