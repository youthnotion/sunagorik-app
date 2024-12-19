import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type GenderSelectProps = {
  value: string;
  onChangeValue: (value: string) => void;
};

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export default function GenderSelect({ value, onChangeValue }: GenderSelectProps) {
  return (
    <View>
      <Text className="text-lg font-JakartaSemiBold mb-4">
        Gender
      </Text>
      <View className="flex-row gap-4">
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChangeValue(option.value)}
            className={`flex-1 p-4 rounded-lg border ${
              value === option.value
                ? 'bg-sunagorik border-sunagorik'
                : 'bg-white border-gray-200'
            }`}
          >
            <Text
              className={`text-center font-JakartaMedium text-[15px] ${
                value === option.value ? 'text-white' : 'text-gray-700'
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
