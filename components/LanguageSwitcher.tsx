import React from 'react';
import { View, TouchableOpacity, Text, Modal, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface LanguageSwitcherProps {
  visible?: boolean;
  onClose?: () => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ visible = false, onClose }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'bn', name: 'Bangla', nativeName: 'বাংলা' }
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} tint="dark" style={{ flex: 1 }}>
        <Pressable 
          className="flex-1 justify-center items-center"
          onPress={onClose}
        >
          <View className="bg-white rounded-xl w-[80%] p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold">Select Language</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                className={`p-4 rounded-lg mb-2 flex-row items-center justify-between ${
                  i18n.language === lang.code ? 'bg-blue-50' : ''
                }`}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <View className="flex-row items-center">
                  <Text className="text-lg">{lang.nativeName}</Text>
                  <Text className="text-sm text-gray-500 ml-2">({lang.name})</Text>
                </View>
                {i18n.language === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color="#CF322C" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </BlurView>
    </Modal>
  );
};
