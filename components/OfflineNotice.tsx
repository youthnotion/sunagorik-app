import React from 'react';
import { View, Text } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

const OfflineNotice = () => {
    const netInfo = useNetInfo();
    console.log(netInfo);
    
    if (netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)
    return (
        <View className='bg-sunagorik/90 p-2'>
            <Text className='text-white text-center font-JakartaLight text-sm'>You are offline. Please check your internet connection.</Text>
        </View>
    );

    return null;
}
 

export default OfflineNotice;