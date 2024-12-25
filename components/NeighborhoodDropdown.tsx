import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { neighborhoods } from "@/constants";
import ErrorMessage from "./ErrorMessage";
import InputField from './InputField';
import { useTranslation } from 'react-i18next';

interface NeighborhoodDropdownProps {
  value: string;
  onChangeValue: (value: string) => void;
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function NeighborhoodDropdown({
  value,
  onChangeValue,
  error,
  touched,
  onBlur,
  onValidationChange
}: NeighborhoodDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customError, setCustomError] = useState<string | undefined>();
  const { t } = useTranslation();


  const filteredNeighborhoods = neighborhoods.filter(n => 
    n.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateNeighborhood = (text: string) => {
    const isValid = !text || neighborhoods.some(n => n.en.toLowerCase() === text.toLowerCase());
    if (!isValid && text) {
      setCustomError(t('components.neighborhoodDropdown.validation.invalidSelection'));
    } else {
      setCustomError(undefined);
    }
    onValidationChange?.(isValid);
    return isValid;
  };

  // Validate initial value
  useEffect(() => {
    validateNeighborhood(value);
  }, [value]);

  return (
    <View className="">
      <View className="relative">
        <InputField
          label={t('components.neighborhoodDropdown.label')}
          value={value}
          onChangeText={(text) => {
            setSearchQuery(text);
            onChangeValue(text);
            setShowDropdown(true);
            validateNeighborhood(text);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={t('components.neighborhoodDropdown.placeholder')}
          onBlur={() => {
            validateNeighborhood(value);
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
                    setCustomError(undefined);
                    onValidationChange?.(true);
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
      <ErrorMessage error={customError || error} visible={touched || !!customError} />
    </View>
  );
}