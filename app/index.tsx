import { Redirect } from "expo-router";
import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import ActivityIndicator from "@/components/ActivityIndicator";
import { View } from "react-native";

const Home = () => {
  const { session, loading, profile } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator visible={true} />
      </View>
    );
  }

  // If we have a session but no profile, they need to complete profile setup
  if (session && !profile) {
    return <Redirect href="/(form)/(profile)/body" />;
  }

  // If we have both session and profile, go to main app
  if (session && profile) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  // No session means user needs to login/signup
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;
