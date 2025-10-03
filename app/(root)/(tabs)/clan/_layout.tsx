import { Stack } from 'expo-router';

export default function ClanLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', animation: 'fade' }}>
      <Stack.Screen 
        name="index"
        options={{
          title: 'Clans',
          headerShown: false,
        }} 
      />,
      <Stack.Screen 
        name="[id]"
        options={{
          title: 'Clan', 
          headerShown: true,
        }}  
      />
    </Stack>
  );
}

