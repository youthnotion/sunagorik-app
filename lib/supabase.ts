import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js/src';

const CustomSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (!value) return null;
      
      // If the stored value is just a refresh token, return it directly
      if (key.endsWith('refresh_token')) return value;
      
      try {
        // For session data, parse and return only if valid
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed);
      } catch {
        return value;
      }
    } catch (error) {
      console.warn('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      let dataToStore = value;
      
      // If this is session data and not just a refresh token
      if (!key.endsWith('refresh_token')) {
        try {
          const parsed = JSON.parse(value);
          // Only store essential session data
          const essentialData = {
            access_token: parsed.access_token,
            refresh_token: parsed.refresh_token,
            expires_at: parsed.expires_at,
            user: {
              id: parsed.user?.id,
              email: parsed.user?.email,
            },
          };
          dataToStore = JSON.stringify(essentialData);
        } catch {
          // If parsing fails, store as is
          dataToStore = value;
        }
      }
      
      if (dataToStore.length > 2000) {
        console.warn('Data too large for SecureStore, trimming...');
        return;
      }
      
      await SecureStore.setItemAsync(key, dataToStore);
    } catch (error) {
      console.warn('SecureStore setItem error:', error);
    }
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error('Supabase Key is undefined');
}

export const getImageUrl = (bucket: string, path: string | null) => {
  if (!path) return null;
  return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};

export const supabase = createClient(supabaseUrl!, supabaseKey, {
  auth: {
    storage: CustomSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});