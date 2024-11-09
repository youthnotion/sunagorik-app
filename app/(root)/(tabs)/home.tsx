import FloatingButton from "@/components/FloatingButton";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StatusBar,
  View
} from "react-native";

const Home = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState(false);
  const loading = false;

  const handleSignOut = () => {};
  const handleDestinationPress = () => {};

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();


      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        // latitude: location.coords.latitude,
        // longitude: location.coords.longitude,
        latitude: 22.866265,
        longitude: 91.097025,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };

    requestLocation();
  }, []);

  return (
    <View>
      <StatusBar translucent barStyle="dark-content" />
      <>
        <View className="flex flex-row items-center bg-transparent h-full relative">
          <Map />
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
