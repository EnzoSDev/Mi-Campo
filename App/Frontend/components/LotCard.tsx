import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Pressable,
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
  const imageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAvH9zY17rUUVHCDpOx89TybToAqyo0riOR9kEMsSK0Kvxv6fB2NSIGCRr-kIoON-84KlThKPJTBD0ReCjvRHsFINpqypwwu_JEnE3p006b050sLoTGV7XN2hwDVl6g6B2osLuJ2QirqKawlZlLCCMqLqkfWexL10qiuBOBv-im5VkYiMRPcUFKqoESQUdN8GNNpKwmUAOzaGjddWwdzlqSjCPKMDxkR08OavkBGTEIO673qL9FztqMqhQDsFj8n-ymVr6JMM8lUR-G";

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
              source={{ uri: imageUrl }}
              className="h-36 w-full"
              imageStyle={{ resizeMode: "cover" }}
            >
              <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <View className="absolute bottom-4 left-4 right-4">
                <Text className="text-white font-bold text-xl leading-6">
                  {lotName}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-[#94a3b8] text-xs italic">
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
