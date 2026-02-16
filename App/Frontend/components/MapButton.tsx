import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function MapButton({ onPress }: { onPress: () => void }) {
  return (
    <View className="px-4 my-2.5">
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
        className="h-[90px] rounded-[20px] justify-center px-4 bg-[#1E293B] border border-white/5"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {/* Contenedor del Icono con fondo redondeado */}
            <View className="w-[54px] h-[54px] rounded-[16px] items-center justify-center bg-[rgba(74,222,128,0.1)]">
              <MaterialIcons name="map" size={24} color="#4ADE80" />
            </View>

            <View className="ml-4">
              <Text className="text-white text-[16px] font-bold mb-0.5">
                View Interactive Map
              </Text>
              <Text className="text-[#94A3B8] text-[14px] font-normal">
                Satellite view & field boundaries
              </Text>
            </View>
          </View>

          <MaterialIcons name="chevron-right" size={24} color="#64748B" />
        </View>
      </Pressable>
    </View>
  );
}
