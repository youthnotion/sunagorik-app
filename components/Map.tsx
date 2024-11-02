import { icons } from "@/constants";
import { mapStyle } from "@/constants/mapStyle";
import { calculateRegion } from "@/lib/map";
import { useLocationStore } from "@/store";
import React, { useState, useCallback, useRef } from "react";
import { Image, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import * as Location from 'expo-location';
import { Ionicons } from "@expo/vector-icons";

function generateRandomMarkers(baseMarkers: any[], count: number) {
  const markers = [...baseMarkers]; // Keep original markers
  const baseCoord = {
    latitude: 22.86079,
    longitude: 91.097788
  };
  
  // 5km in degrees - approximate values
  const LAT_KM = 0.009;
  const LNG_KM = 0.009;
  const RADIUS = 10; // 5km radius

  const titles = ["Waste", "Pothole", "Road Blocked", "Flood", "Tree Down", "Street Light", "Drainage"];
  const descriptions = [
    "Waste hasn't been collected",
    "Deep pothole on the road",
    "Road blocked by construction",
    "Water logging issue",
    "Fallen tree blocking path",
    "Street light not working",
    "Drainage system blocked"
  ];

  for (let i = 0; i < count; i++) {
    // Generate random angle and distance
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.sqrt(Math.random()) * RADIUS; // sqrt for uniform distribution

    // Convert polar coordinates to lat/lng
    const latOffset = distance * LAT_KM * Math.cos(angle);
    const lngOffset = distance * LNG_KM * Math.sin(angle);

    // Random title and description
    const randomTitleIndex = Math.floor(Math.random() * titles.length);
    
    markers.push({
      title: titles[randomTitleIndex],
      description: descriptions[randomTitleIndex],
      coordinate: {
        latitude: baseCoord.latitude + latOffset,
        longitude: baseCoord.longitude + lngOffset
      }
    });
  }

  return markers;
}

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  });
  // console.log(region);

  const markers = [
    {
      title: "Waste",
      description: "Waste hasnt been collected for a week",
      coordinate: { latitude: 22.86079, longitude: 91.097788 },
    },
    {
      title: "Pothole",
      description: "Pothole on the road",
      coordinate: { latitude: 22.870814, longitude: 91.095526 },
    },
    {
      title: "Road Blocked",
      description: "Road is blocked by construction materials",
      coordinate: { latitude: 22.865298, longitude: 91.098512 },
    },
    {
      title: "Flood",
      description: "Flood in the area",
      coordinate: { latitude: 22.86937, longitude: 91.096147 },
    },
  ];

  const allMarkers = React.useMemo(() => generateRandomMarkers(markers, 1000), []);
  const [visibleMarkers, setVisibleMarkers] = useState<any[]>([]);
  const [isRecentering, setIsRecentering] = useState(false);

  const onRegionChangeComplete = useCallback((region) => {
    requestAnimationFrame(() => {
      const visible = allMarkers.filter(marker => 
        marker.coordinate.latitude >= region.latitude - region.latitudeDelta/2 &&
        marker.coordinate.latitude <= region.latitude + region.latitudeDelta/2 &&
        marker.coordinate.longitude >= region.longitude - region.longitudeDelta/2 &&
        marker.coordinate.longitude <= region.longitude + region.longitudeDelta/2
      ).slice(0, 200); // Limit visible markers for performance
      setVisibleMarkers(visible);
    });
  }, [allMarkers]);

  const mapRef = useRef<MapView>(null);

  const recenterToUser = async () => {
    try {
      setIsRecentering(true);
      const location = await Location.getCurrentPositionAsync({});
      // console.log(location);

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      mapRef.current?.animateToRegion(newRegion, 4000);
    } catch (error) {
      console.log('Error getting location:', error);
    } finally {
      setIsRecentering(false);
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
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        userInterfaceStyle="light"
        zoomEnabled={true}
    
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {visibleMarkers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            image={icons.tree}
            tracksViewChanges={false}
          />
        ))}
      </MapView>

      <TouchableOpacity
        onPress={recenterToUser}
        disabled={isRecentering}
        className={`absolute bottom-56 right-5 bg-sunagorik w-[60px] h-[60px] rounded-2xl items-center justify-center shadow-lg shadow-black`}
      >
        {isRecentering ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Ionicons name="locate" size={26} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Map;
