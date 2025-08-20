import { Stack } from 'expo-router';

export default function FeedLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', animation: 'fade' }}>
      <Stack.Screen 
        name="index"
        options={{
          title: 'Clans',
        }}
      />
    </Stack>
  );
}

