import { usePostsInView } from "@/api/post/index";
import FloatingButton from "@/components/FloatingButton";
import Map from "@/components/Map";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { StatusBar, View } from "react-native";
import { Region } from "react-native-maps";

const Home = () => {
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 22.866265,
    longitude: 91.097025,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const { data: postsInView = [] } = usePostsInView(currentRegion);

  const handleRegionChange = useMemo(
    () =>
      debounce((region: Region) => {
        setCurrentRegion(region);
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      handleRegionChange.cancel();
    };
  }, [handleRegionChange]);

  return (
    <View className="flex-1">
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="dark-content" 
      />
      <View className="flex-1 relative">
        <Map 
          onRegionChangeComplete={handleRegionChange}
          posts={postsInView}
        />
        <FloatingButton
          title={<FontAwesome6 name="plus" size={26} color="white" />}
          onPress={() => router.push("/(form)/(post)/category")}
        />
      </View>
    </View>
  );
};

export default Home;
