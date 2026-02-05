import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

function AddField() {
  return (
    <View className="flex-1 bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-border-dark/50 bg-background-dark">
        <TouchableOpacity className="p-2 rounded-full bg-surface-dark mr-2">
          <MaterialIcons
            name="arrow-back"
            size={20}
            color="white"
            onPress={() => router.back()}
          />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text-bright">Añadir Campo</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Section: Information */}
        <View className="mb-8">
          <View className="mb-4">
            <Text className="text-sm font-bold uppercase tracking-widest text-primary">
              Información
            </Text>
            <Text className="text-xs text-text-muted">
              Ingresa los detalles principales de tu propiedad agrícola.
            </Text>
          </View>

          <View className="bg-surface-dark p-2 rounded-xl">
            {/* Input Farm Name */}
            <View className="p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Nombre de la Finca
              </Text>
              <TextInput
                className="text-base text-text-bright border-b border-border-dark py-2"
                placeholder="Ej: Estancia La Paz"
                placeholderTextColor="#96999E66"
              />
            </View>

            {/* Input Location */}
            <View className="p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Ubicación/Dirección
              </Text>
              <View className="flex-row items-center border-b border-border-dark">
                <TextInput
                  className="flex-1 text-base text-text-bright py-2"
                  placeholder="Ej: Pergamino, Buenos Aires"
                  placeholderTextColor="#96999E66"
                />
                <MaterialIcons name="location-on" size={20} color="#96999E" />
              </View>
            </View>

            {/* Input Description */}
            <View className="p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Descripción / Notas
              </Text>
              <TextInput
                className="text-base text-text-bright border-b border-border-dark py-2"
                placeholder="Añade detalles..."
                placeholderTextColor="#96999E66"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Section: Boundary Definition */}
        <View className="mb-8">
          <View className="mb-4">
            <Text className="text-sm font-bold uppercase tracking-widest text-primary">
              Definición de Límites
            </Text>
            <Text className="text-xs text-text-muted">
              Define los límites espaciales de tu campo.
            </Text>
          </View>

          <View className="space-y-4">
            {/* Option Draw */}
            <TouchableOpacity className="flex-row items-center p-4 bg-surface-dark border border-border-dark rounded-xl mb-4">
              <View className="w-12 h-12 items-center justify-center rounded-lg bg-primary/10 mr-4">
                <MaterialIcons name="gesture" size={24} color="#267366" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-text-bright">
                  Dibujar Límites en el Mapa
                </Text>
                <Text className="text-xs text-text-muted">
                  Traza manualmente los bordes de tu campo
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#96999E" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-4 bg-background-dark border-t border-border-dark/50">
          <TouchableOpacity className="w-full bg-primary flex-row items-center justify-center py-4 rounded-xl shadow-lg">
            <Text className="text-white font-bold text-base mr-2">
              Crear Finca
            </Text>
            <MaterialIcons name="check-circle" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default AddField;
