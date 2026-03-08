import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

interface LotCardProps {
  id: number;
  lotName: string;
  areaHa: number;
  description: string;
  handleDelete: (id: number) => void;
}

function LotCard({
  id,
  lotName,
  areaHa,
  description,
  handleDelete,
}: LotCardProps) {
  // Imagenes de campo/agricultura (consistentes por id de lote)
  const fieldImages = [
    require("../assets/images/lotes/lote1.jpg"),
    require("../assets/images/lotes/lote2.jpg"),
    require("../assets/images/lotes/lote3.jpg"),
    require("../assets/images/lotes/lote4.jpg"),
    require("../assets/images/lotes/lote5.jpg"),
  ];

  const selectedImage = fieldImages[id % fieldImages.length];

  return (
    <Link
      href={{
        pathname: "/(tabs)/(register)/(field)/(lots)/[lotId]",
        params: { lotId: id, lotName },
      }}
      asChild
    >
      <Pressable className="bg-white dark:bg-[#2d3136] rounded-2xl overflow-hidden">
        <View className="flex-1">
          <View className="rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
            <ImageBackground
              source={selectedImage}
              style={{ height: 144, width: "100%" }}
              resizeMode="cover"
            >
              <View className="absolute inset-0 bg-black/45" />

              <View className="absolute bottom-4 left-4 right-4">
                <Text className="text-white font-bold text-xl leading-6 drop-shadow-lg">
                  {lotName}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-white text-xs italic drop-shadow">
                    {description}
                  </Text>
                </View>
              </View>
            </ImageBackground>

            <View className="flex-row items-center justify-between gap-3 p-4 dark:bg-surface-dark">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-400">
                  Hectareas
                </Text>
                <Text className="text-base font-bold text-white">
                  {areaHa.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row gap-2">
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
      </Pressable>
    </Link>
  );
}

export default LotCard;
