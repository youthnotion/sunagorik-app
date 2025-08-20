import AuthProvider from "@/providers/AuthProvider";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(post)" options={{ headerShown: false }} />
        <Stack.Screen name="(profile)" options={{ headerShown: false }} />
        <Stack.Screen name="(clan)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
};

export default Layout;
