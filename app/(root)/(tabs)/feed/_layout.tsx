import { Stack } from 'expo-router';

export default function FeedLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', animation: 'fade' }}>
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

