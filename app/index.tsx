import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';

const Home = () => {
  const { session, loading, profile } = useAuth();
  
  if (session) return <Redirect href={"/(tabs)/home"} />;
  return <Redirect href={"/(auth)/welcome"} />;
}


export default Home;