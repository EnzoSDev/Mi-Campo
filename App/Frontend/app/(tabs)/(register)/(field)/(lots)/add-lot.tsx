import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

function AddLot() {
  const { fieldId } = useLocalSearchParams();
  const [lotName, setLotName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDrawInMap = async () => {
    setError("");
    setLoading(true);

    try {
      // Validar campos obligatorios
      if (lotName === "" || description === "") {
        setError("Por favor, completa todos los campos antes de continuar.");
        return;
      }

      router.push({
        pathname: "./draw-lot-in-map",
        params: {
          fieldId,
          lotName,
          description,
        },
      });
    } catch (error) {
      setError("Ocurrió un error al obtener la ubicación. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-border-dark/50 bg-background-dark">
        <TouchableOpacity
          className="p-2 rounded-full bg-surface-dark mr-2"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text-bright">Añadir Lote</Text>
      </View>

      {/* Error Message */}
      {error !== "" && (
        <View className="mx-4 mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex-row items-start">
          <MaterialIcons name="error-outline" size={20} color="#ef4444" />
          <View className="flex-1 ml-3">
            <Text className="text-sm text-red-300">{error}</Text>
          </View>
          <TouchableOpacity onPress={() => setError("")}>
            <MaterialIcons name="close" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="flex-1 px-4 py-6">
        {/* Section: Information */}
        <View className="mb-8">
          <View className="mb-4">
            <Text className="text-sm font-bold uppercase tracking-widest text-primary">
              Información
            </Text>
            <Text className="text-xs text-text-muted">
              Proporciona detalles básicos sobre tu lote.
            </Text>
          </View>

          <View className="bg-surface-dark p-2 rounded-xl">
            {/* Input Farm Name */}
            <View className="p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Nombre del Lote
              </Text>
              <TextInput
                className="text-base text-text-bright border-b border-border-dark py-2"
                placeholder="Ej: Lote 1"
                placeholderTextColor="#96999E66"
                onChangeText={setLotName}
              />
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
                onChangeText={setDescription}
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
              Define los límites espaciales de tu lote
            </Text>
          </View>

          <View className="space-y-4">
            {/* Option Draw */}
            <TouchableOpacity
              className="flex-row items-center p-4 bg-surface-dark border border-border-dark rounded-xl mb-4"
              onPress={handleDrawInMap}
              disabled={loading}
            >
              <View className="w-12 h-12 items-center justify-center rounded-lg bg-primary/10 mr-4">
                {loading ? (
                  <ActivityIndicator size="small" color="#267366" />
                ) : (
                  <MaterialIcons name="gesture" size={24} color="#267366" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-text-bright">
                  {loading ? "Cargando Mapa..." : "Dibujar Límites en el Mapa"}
                </Text>
                <Text className="text-xs text-text-muted">
                  {loading
                    ? "Por favor espera"
                    : "Traza manualmente los bordes de tu lote en el mapa"}
                </Text>
              </View>
              {!loading && (
                <MaterialIcons name="chevron-right" size={24} color="#96999E" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default AddLot;
