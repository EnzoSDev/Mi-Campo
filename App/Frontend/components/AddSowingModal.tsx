import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";

function AddSowingModal({
  setShowAddModal,
}: {
  setShowAddModal: (value: boolean) => void;
}) {
  const { campaignId } = useLocalSearchParams();
  const [cropType, setCropType] = useState<string>("");
  const [variety, setVariety] = useState<string>("");
  const [sowingDate, setSowingDate] = useState<Date | null>(null);
  const [showSowingPicker, setShowSowingPicker] = useState(false);
  const [density, setDensity] = useState<string>("");
  const [rowSpacing, setRowSpacing] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (value: Date | null) => {
    if (!value) return "Seleccionar fecha";
    return value.toLocaleDateString("es-AR");
  };

  const handleSaveSowing = async () => {
    setError("");
    setLoading(true);

    if (
      !cropType ||
      !variety ||
      !sowingDate ||
      !density ||
      !rowSpacing ||
      !method
    ) {
      setError("Por favor, completa todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    try {
      // TODO: Integrar con API cuando esté disponible
      // await sowingAPI.createSowing(campaignId, {
      //   crop_type: cropType,
      //   variety,
      //   sowing_date: sowingDate,
      //   density: parseInt(density),
      //   row_spacing: parseFloat(rowSpacing),
      //   method,
      // });
      setShowAddModal(false);
    } catch (error: any) {
      setError(error.message || "Error al crear el registro de siembra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={true}
      transparent={false}
      animationType="slide"
      onRequestClose={() => setShowAddModal(false)}
    >
      <View className="flex-1 bg-[#0F1113]">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-white/10 bg-[#0F1113]">
          <TouchableOpacity
            className="p-2 rounded-full bg-[#16181A] mr-2"
            onPress={() => setShowAddModal(false)}
          >
            <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">
            Registrar Siembra
          </Text>
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
          {/* Section: Cultivo */}
          <View className="mb-8">
            <View className="mb-4">
              <Text className="text-sm font-bold uppercase tracking-widest text-[#3FA39B]">
                Cultivo
              </Text>
              <Text className="text-xs text-white/50">
                Información del tipo de cultivo.
              </Text>
            </View>

            <View className="bg-[#16181A] p-2 rounded-xl border border-white/10">
              {/* Crop Type */}
              <View className="p-3">
                <Text className="text-xs font-medium text-white/70 mb-1">
                  Tipo de Cultivo *
                </Text>
                <TextInput
                  className="text-base text-white border-b border-white/10 py-2"
                  placeholder="Ej: Maíz, Soja, Trigo"
                  placeholderTextColor="#ffffff40"
                  value={cropType}
                  onChangeText={setCropType}
                />
              </View>

              {/* Variety */}
              <View className="p-3">
                <Text className="text-xs font-medium text-white/70 mb-1">
                  Variedad *
                </Text>
                <TextInput
                  className="text-base text-white border-b border-white/10 py-2"
                  placeholder="Ej: P1197, AG36, Skyfall"
                  placeholderTextColor="#ffffff40"
                  value={variety}
                  onChangeText={setVariety}
                />
              </View>

              {/* Sowing Date */}
              <View className="p-3">
                <Text className="text-xs font-medium text-white/70 mb-1">
                  Fecha de Siembra *
                </Text>
                <TouchableOpacity
                  className="border-b border-white/10 py-2"
                  onPress={() => setShowSowingPicker(true)}
                >
                  <Text
                    className={
                      sowingDate
                        ? "text-base text-white"
                        : "text-base text-white/50"
                    }
                  >
                    {formatDate(sowingDate)}
                  </Text>
                </TouchableOpacity>
                {showSowingPicker && (
                  <DateTimePicker
                    value={sowingDate ?? new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(_, selected) => {
                      setShowSowingPicker(false);
                      if (selected) setSowingDate(selected);
                    }}
                  />
                )}
              </View>
            </View>
          </View>

          {/* Section: Parámetros */}
          <View className="mb-8">
            <View className="mb-4">
              <Text className="text-sm font-bold uppercase tracking-widest text-[#3FA39B]">
                Parámetros de Siembra
              </Text>
              <Text className="text-xs text-white/50">
                Detalles técnicos de la siembra.
              </Text>
            </View>

            <View className="bg-[#16181A] p-2 rounded-xl border border-white/10">
              {/* Density */}
              <View className="p-3">
                <Text className="text-xs font-medium text-white/70 mb-1">
                  Densidad (semillas/m²) *
                </Text>
                <TextInput
                  className="text-base text-white border-b border-white/10 py-2"
                  placeholder="Ej: 8, 10, 12"
                  placeholderTextColor="#ffffff40"
                  keyboardType="numeric"
                  value={density}
                  onChangeText={setDensity}
                />
              </View>

              {/* Row Spacing */}
              <View className="p-3">
                <Text className="text-xs font-medium text-white/70 mb-1">
                  Distancia entre Filas (m) *
                </Text>
                <TextInput
                  className="text-base text-white border-b border-white/10 py-2"
                  placeholder="Ej: 0.52, 0.70, 0.35"
                  placeholderTextColor="#ffffff40"
                  keyboardType="decimal-pad"
                  value={rowSpacing}
                  onChangeText={setRowSpacing}
                />
              </View>

              {/* Method */}
              <View className="p-3">
                <Text className="text-xs font-medium text-white/70 mb-1">
                  Método de Siembra *
                </Text>
                <TextInput
                  className="text-base text-white border-b border-white/10 py-2"
                  placeholder="Ej: Directa, Convencional"
                  placeholderTextColor="#ffffff40"
                  value={method}
                  onChangeText={setMethod}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="px-4 pb-6 pt-2 bg-[#0F1113]">
          {loading ? (
            <ActivityIndicator size="large" color="#3FA39B" />
          ) : (
            <TouchableOpacity
              className="w-full bg-[#3FA39B] py-4 rounded-xl shadow-lg flex items-center justify-center"
              onPress={handleSaveSowing}
            >
              <Text className="text-base text-[#0F1113] font-bold">
                Guardar Siembra
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default AddSowingModal;
