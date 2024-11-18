import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { neighborhoods } from "@/constants";
import ErrorMessage from "./ErrorMessage";
import InputField from './InputField';

interface NeighborhoodDropdownProps {
  value: string;
  onChangeValue: (value: string) => void;
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
}

export default function NeighborhoodDropdown({
  value,
  onChangeValue,
  error,
  touched,
  onBlur
}: NeighborhoodDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNeighborhoods = neighborhoods.filter(n => 
    n.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="">
      <View className="relative">
        <InputField
          label="Neighborhood"
          value={value}
          onChangeText={(text) => {
            setSearchQuery(text);
            onChangeValue(text);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Start typing the name of your area"
          onBlur={() => {
            onBlur?.();
            setTimeout(() => setShowDropdown(false), 200);
          }}
        />
        
        {showDropdown && filteredNeighborhoods.length > 0 && (
          <View className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-48">
            <ScrollView 
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {filteredNeighborhoods.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="p-4 border-b border-gray-100"
                  onPress={() => {
                    onChangeValue(item.en);
                    setSearchQuery(item.en);
                    setShowDropdown(false);
                  }}
                >
                  <Text className="font-JakartaMedium">{item.en}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      <ErrorMessage error={error} visible={touched} />
    </View>
  );
}