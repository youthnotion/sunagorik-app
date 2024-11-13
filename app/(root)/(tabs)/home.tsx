import { usePostsInView } from "@/api/post/index";
import FloatingButton from "@/components/FloatingButton";
import Map from "@/components/Map";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  StatusBar,
  View
} from "react-native";
import { Region } from "react-native-maps";

const Home = () => {
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 22.866265,
    longitude: 91.097025,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const { data: postsInView = [] } = usePostsInView(currentRegion);

  // Create memoized debounced function
  const handleRegionChange = useMemo(
    () =>
      debounce((region: Region) => {
        setCurrentRegion(region);
      }, 500),
    [] // Empty dependency array since we don't want to recreate this function
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      handleRegionChange.cancel();
    };
  }, [handleRegionChange]);

  return (
    <View>
      <StatusBar translucent barStyle="dark-content" />
      <>
        <View className="flex flex-row items-center bg-transparent h-full relative">
          <Map 
            onRegionChangeComplete={handleRegionChange}
            posts={postsInView}
          />
          <FloatingButton
            title={<FontAwesome6 name="plus" size={26} color="white" />}
            onPress={() => router.push("/(form)/category")}
          />
        </View>
      </>
    </View>
  );
};

export default Home;
