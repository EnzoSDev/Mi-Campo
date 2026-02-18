import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

function LotCard() {
  const imageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAvH9zY17rUUVHCDpOx89TybToAqyo0riOR9kEMsSK0Kvxv6fB2NSIGCRr-kIoON-84KlThKPJTBD0ReCjvRHsFINpqypwwu_JEnE3p006b050sLoTGV7XN2hwDVl6g6B2osLuJ2QirqKawlZlLCCMqLqkfWexL10qiuBOBv-im5VkYiMRPcUFKqoESQUdN8GNNpKwmUAOzaGjddWwdzlqSjCPKMDxkR08OavkBGTEIO673qL9FztqMqhQDsFj8n-ymVr6JMM8lUR-G";

  return (
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
              Lote Norte
            </Text>
            <View className="flex-row items-center">
              <Text className="text-[#94a3b8] text-xs italic">
                Soybean • Campaign 24/25
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View className="flex-row items-center justify-between gap-3 p-4 dark:bg-surface-dark">
          <View className="flex-1">
            <Text className="text-xs font-semibold text-slate-400">
              Hectareas
            </Text>
            <Text className="text-base font-bold text-white">120.5</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="px-6 h-10 rounded-xl bg-[#267366] items-center justify-center"
              onPress={() => router.replace("/(tabs)/(register)/(field)/lots")}
            >
              <Text className="text-white text-sm font-semibold">Ver</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-xl bg-red-500/20 items-center justify-center">
              <MaterialIcons name="delete" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default LotCard;
