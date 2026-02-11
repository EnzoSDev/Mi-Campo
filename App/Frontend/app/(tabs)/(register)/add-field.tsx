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
import { router } from "expo-router";
import * as Location from "expo-location";

function AddField() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDrawInMap = async () => {
    setError("");
    setLoading(true);

    try {
      // Validar campos obligatorios
      if (name === "" || address === "" || description === "") {
        setError("Por favor, completa todos los campos antes de continuar.");
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Se necesita permiso de ubicación para continuar.");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      router.push({
        pathname: "/(tabs)/(register)/draw-field-in-map",
        params: {
          latitude: String(loc.coords.latitude),
          longitude: String(loc.coords.longitude),
          field_name: name,
          location_name: address,
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
        <Text className="text-lg font-bold text-text-bright">Añadir Campo</Text>
      </View>

      {/* Error Message */}
      {error !== "" && (
        <View className="mx-4 mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex-row items-start">
          <MaterialIcons name="error-outline" size={20} color="#ef4444" />
          <View className="flex-1 ml-3">
            <Text className="text-sm font-semibold text-red-400 mb-1">
              Error
            </Text>
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
              Ingresa los detalles principales de tu propiedad agrícola.
            </Text>
          </View>

          <View className="bg-surface-dark p-2 rounded-xl">
            {/* Input Farm Name */}
            <View className="p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Nombre del Campo
              </Text>
              <TextInput
                className="text-base text-text-bright border-b border-border-dark py-2"
                placeholder="Ej: Estancia La Paz"
                placeholderTextColor="#96999E66"
                onChangeText={setName}
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
                  onChangeText={setAddress}
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
              Define los límites espaciales de tu campo.
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
                  {loading
                    ? "Obteniendo ubicación..."
                    : "Dibujar Límites en el Mapa"}
                </Text>
                <Text className="text-xs text-text-muted">
                  {loading
                    ? "Por favor espera"
                    : "Traza manualmente los bordes de tu campo"}
                </Text>
              </View>
              {!loading && (
                <MaterialIcons name="chevron-right" size={24} color="#96999E" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-4 bg-background-dark border-t border-border-dark/50">
          <TouchableOpacity className="w-full bg-primary flex-row items-center justify-center py-4 rounded-xl shadow-lg">
            <Text className="text-white font-bold text-base mr-2">
              Crear Campo
            </Text>
            <MaterialIcons name="check-circle" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default AddField;
