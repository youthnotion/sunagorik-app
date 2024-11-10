import { categories, icons } from "@/constants";
import { mapStyle } from "@/constants/mapStyle";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE
} from "react-native-maps";

interface Post {
  id: number;
  category: string;
  title: string;
  lat: number;
  long: number;
}

interface MapProps {
  onRegionChangeComplete: (region: any) => void;
  posts: Post[];
}

const Map = ({ onRegionChangeComplete, posts }: MapProps) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 22.866265,
    longitude: 91.097025,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const initialRegion = {
    latitude: 22.866265,
    longitude: 91.097025,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const recenterToUser = async () => {
    try {
      // const location = await Location.getCurrentPositionAsync({});

      // const newRegion = {
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      //   latitudeDelta: 0.01,
      //   longitudeDelta: 0.01,
      // };
      
      mapRef.current?.animateToRegion(initialRegion, 3000);
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  // Bangladesh boundaries
  const bangladeshBounds = {
    northEast: {
      latitude: 26.634,
      longitude: 92.673
    },
    southWest: {
      latitude: 20.743,
      longitude: 88.028
    }
  };

  return (
    <View className="flex-1 relative">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        className="w-full h-full rounded-2xl"
        tintColor="black"
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        userInterfaceStyle="light"
        zoomEnabled={true}
        minZoomLevel={7}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
        region={region}
        onRegionChangeComplete={(newRegion) => {
          // Prevent moving outside Bangladesh bounds
          const constrainedRegion = {
            ...newRegion,
            latitude: Math.min(Math.max(newRegion.latitude, bangladeshBounds.southWest.latitude), bangladeshBounds.northEast.latitude),
            longitude: Math.min(Math.max(newRegion.longitude, bangladeshBounds.southWest.longitude), bangladeshBounds.northEast.longitude),
          };
          setRegion(constrainedRegion);
          onRegionChangeComplete(constrainedRegion);
        }}
      >
        {posts.map((post) => (
          <Marker
            key={post.id}
            coordinate={{
              latitude: post.lat,
              longitude: post.long
            }}
            title={post.category}
            description={post.title}
            image={categories.find((category) => category.title === post.category)?.image}
            tracksViewChanges={false}
          />
        ))}
      </MapView>

      <TouchableOpacity
        onPress={recenterToUser}
        className={`absolute bottom-56 right-5 bg-sunagorik w-[60px] h-[60px] rounded-2xl items-center justify-center shadow-lg shadow-black`}
      >
        <Ionicons name="locate" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Map;
