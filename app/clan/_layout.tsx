import { Stack } from "expo-router";

export default function ClanStackLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', animation: 'fade' }}>
      <Stack.Screen 
        name="[id]"
        options={{
          title: 'Clan', 
        }} 
      />
    </Stack>
  );
}
