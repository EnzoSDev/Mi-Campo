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
import { campaignAPI } from "@/services/campaignAPI";
import { ObservationType } from "@/types/campaignTypes";

function AddObservationModal({
  setShowAddModal,
  fetchObservations,
}: {
  setShowAddModal: (value: boolean) => void;
  fetchObservations: () => void;
}) {
  const { campaignId } = useLocalSearchParams();
  const [observationDate, setObservationDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (value: Date | null) => {
    if (!value) return "Seleccionar fecha";
    return value.toLocaleDateString("es-AR");
  };

  const handleSave = async () => {
    setError("");
    setLoading(true);

    if (!observationDate || !note) {
      setError("Por favor, completa todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const observationData: ObservationType = {
        campaignId: parseInt(campaignId as string),
        observationDate: observationDate,
        note,
      };
      await campaignAPI.createObservation(
        parseInt(campaignId as string),
        observationData,
      );
      fetchObservations();
      setShowAddModal(false);
    } catch (error: any) {
      setError(error.message || "Error al crear la observación.");
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
            Registrar Observación
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
          {/* Section: Observación */}
          <View className="mb-8">
            <View className="mb-4">
              <Text className="text-sm font-bold uppercase tracking-widest text-[#3FA39B]">
                Observación
              </Text>
              <Text className="text-xs text-white/50">
                Registra una observación del campo.
              </Text>
            </View>

            <View className="bg-[#16181A] p-2 rounded-xl border border-white/10">
              {/* Observation Date */}
              <View className="p-3">
                <Text className="text-xs font-medium text-white/70 mb-1">
                  Fecha de Observación *
                </Text>
                <TouchableOpacity
                  className="border-b border-white/10 py-2"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    className={
                      observationDate
                        ? "text-base text-white"
                        : "text-base text-white/50"
                    }
                  >
                    {formatDate(observationDate)}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={observationDate ?? new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(_, selected) => {
                      setShowDatePicker(false);
                      if (selected) setObservationDate(selected);
                    }}
                  />
                )}
              </View>

              {/* Note */}
              <View className="p-3">
                <Text className="text-xs font-medium text-white/70 mb-1">
                  Nota *
                </Text>
                <TextInput
                  className="text-base text-white border border-white/10 py-2 px-3 rounded-lg h-32"
                  placeholder="Describe lo observado: estado del cultivo, plagas, enfermedades, condiciones del clima, etc."
                  placeholderTextColor="#ffffff40"
                  value={note}
                  onChangeText={setNote}
                  multiline={true}
                  textAlignVertical="top"
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
              onPress={handleSave}
            >
              <Text className="text-base text-[#0F1113] font-bold">
                Guardar Observación
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default AddObservationModal;
