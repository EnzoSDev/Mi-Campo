import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo } from "react";

interface Prop {
  id: number;
  name: string;
  location: string;
  areaHa: number;
  description: string;
  handleDelete: (id: number) => Promise<void>;
}

const fieldImages = [
  require("../assets/images/campos/1.jpg"),
  require("../assets/images/campos/2.jpg"),
  require("../assets/images/campos/3.jpg"),
  require("../assets/images/campos/4.jpg"),
  require("../assets/images/campos/5.jpg"),
];

function FieldCard({
  id,
  name,
  location,
  areaHa,
  description,
  handleDelete,
}: Prop) {
  const randomImage = useMemo(() => {
    return fieldImages[id % fieldImages.length];
  }, [id]);

  return (
    <View className="bg-white dark:bg-[#2d3136] rounded-2xl overflow-hidden">
      <View className="w-full h-[200px]">
        <Image
          source={randomImage}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="p-5">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-[#0f172a] dark:text-white text-xl font-bold">
              {name}
            </Text>
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="location-on" size={14} color="#64748b" />
              <Text className="text-[#64748b] dark:text-[#94a3b8] text-sm ml-1">
                {location}
              </Text>
            </View>
          </View>
          <View className="items-end ml-2">
            <Text className="text-[#267366] font-bold text-lg">
              {areaHa.toLocaleString()}
            </Text>
            <Text className="text-[#94a3b8] text-[10px] uppercase font-bold tracking-widest">
              Hectareas
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-[#94a3b8] text-xs italic">{description}</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity className="px-6 h-10 rounded-xl bg-[#267366] items-center justify-center">
              <Text className="text-white text-sm font-semibold">
                Seleccionar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 rounded-xl bg-red-500/20 items-center justify-center"
              onPress={() => handleDelete(id)}
            >
              <MaterialIcons name="delete" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default FieldCard;
