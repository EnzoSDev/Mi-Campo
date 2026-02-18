import { View, Text } from "react-native";
import LotCard from "@/components/LotCard";

function Lots() {
  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4 text-white">Mis Lotes</Text>
      <LotCard />
    </View>
  );
}

export default Lots;
