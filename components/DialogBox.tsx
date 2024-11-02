import { FontAwesome } from "@expo/vector-icons";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import CustomButton from "./CustomButton";

const DialogBox = (visible: boolean, setVisible: () => void) => {
    return (
        <Modal
        visible={visible}
        // onBackdropPress={() => setVisible(false)}
        className="m-0"
      >
        <View className="bg-white p-4 rounded-t-3xl absolute bottom-0 w-full">
          <View className="items-center mb-4">
            <View className="w-16 h-1 bg-gray-300 rounded-full" />
          </View>
          
          <Text className="text-xl font-JakartaBold mb-4">Rate Severity</Text>
          
          <View className="flex-row justify-center gap-x-4 mb-6">
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity key={rating} className="items-center">
                <FontAwesome 
                  name="star" 
                  size={32} 
                  color="#CF322C" 
                />
                <Text className="mt-1">{rating}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomButton 
            title="Submit Rating" 
            onPress={() => {
              // Handle rating submission
              setVisible();
            }}
          />
        </View>
      </Modal>
    )
}

export default DialogBox;