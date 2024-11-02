import { Stack } from 'expo-router';

export default function FeedLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', animation: 'slide_from_bottom' }}>
      <Stack.Screen 
        name="index"
        options={{
          title: 'Feed',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Report Details',
          headerShown: true,
        }}
      />
    </Stack>
  );
}

