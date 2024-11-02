import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface StarRatingProps {
  maxStars?: number;
  rating?: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  disabled?: boolean;
}

const StarRating = ({ 
  maxStars = 5, 
  rating = 0, 
  onRatingChange,
  size = 32,
  disabled = false
}: StarRatingProps) => {
  const [selectedStars, setSelectedStars] = useState(rating);

  const handlePress = (starIndex: number) => {
    if (disabled) return;
    const newRating = starIndex + 1;
    setSelectedStars(newRating);
    onRatingChange?.(newRating);
  };

  return (
    <View className="flex-row gap-x-4">
      {[...Array(maxStars)].map((_, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          onPress={() => handlePress(index)}
          disabled={disabled}
          className="items-center"
        >
          <FontAwesome
            name={index < selectedStars ? "star" : "star-o"}
            size={size}
            color="#CF322C"
          />
          <Text className="mt-1">{index + 1}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRating;

