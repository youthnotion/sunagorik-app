import React from 'react';
import { View, Text } from 'react-native';

const ErrorMessage = ({ error, visible }: { error: string | undefined, visible: boolean | undefined }) => {
    if (!error || !visible) return null;

    return (
        <View className='w-full' >
            <Text className='text-sm text-red-500 font-JakartaSemiBold'>{error}</Text>
        </View>
    );
}


export default ErrorMessage;