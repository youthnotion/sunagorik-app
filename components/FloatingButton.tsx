import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface FloatingButtonProps {
  title: React.ReactNode;
  onPress?: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      className="absolute bottom-36 right-5 bg-sunagorik w-[60px] h-[60px] rounded-2xl items-center justify-center shadow-lg shadow-black"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className="text-white text-3xl font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default FloatingButton;
