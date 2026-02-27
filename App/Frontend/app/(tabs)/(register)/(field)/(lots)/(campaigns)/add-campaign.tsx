import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { lotAPI } from "@/services/lotAPI";
import { CreateCampaignType } from "@/types/lotTypes";

function AddCampaign() {
  const { lotId } = useLocalSearchParams();
  const [campaignName, setCampaignName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (value: Date | null) => {
    if (!value) return "Seleccionar fecha";
    return value.toLocaleDateString("es-AR");
  };

  const handleSaveCampaign = async () => {
    setError("");
    setLoading(true);

    if (campaignName === "" || !startDate || !endDate) {
      setError("Por favor, completa todos los campos obligatorios.");
      setLoading(false);
      return;
    } else if (endDate < startDate) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio.");
      setLoading(false);
      return;
    } else if (endDate < new Date()) {
      setError("La fecha de fin no puede ser anterior a la fecha actual.");
      setLoading(false);
      return;
    }

    const campaignData: CreateCampaignType = {
      campaignName,
      startDate,
      endDate,
      description,
    };

    try {
      await lotAPI.createCampaign(Number(lotId), campaignData);
      router.back();
    } catch (error: any) {
      setError(error.message || "Error al crear la campaña.");
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
        <Text className="text-lg font-bold text-text-bright">
          Añadir Campaña
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
        {/* Section: Information */}
        <View className="mb-8">
          <View className="mb-4">
            <Text className="text-sm font-bold uppercase tracking-widest text-primary">
              Información
            </Text>
            <Text className="text-xs text-text-muted">
              Proporciona detalles básicos sobre tu campaña.
            </Text>
          </View>

          <View className="bg-surface-dark p-2 rounded-xl">
            {/* Input Campaign Name */}
            <View className="p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Nombre de la Campaña
              </Text>
              <TextInput
                className="text-base text-text-bright border-b border-border-dark py-2"
                placeholder="Ej: Lote 1"
                placeholderTextColor="#96999E66"
                onChangeText={setCampaignName}
              />
            </View>

            {/* Input Start Date */}
            <View className="p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Fecha de Inicio
              </Text>
              <TouchableOpacity
                className="border-b border-border-dark py-2"
                onPress={() => setShowStartPicker(true)}
              >
                <Text
                  className={
                    startDate
                      ? "text-base text-text-bright"
                      : "text-base text-text-muted"
                  }
                >
                  {formatDate(startDate)}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate ?? new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, selected) => {
                    setShowStartPicker(false);
                    if (selected) setStartDate(selected);
                  }}
                />
              )}
            </View>

            {/* Input End Date */}
            <View className="p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Fecha estimada de fin
              </Text>
              <TouchableOpacity
                className="border-b border-border-dark py-2"
                onPress={() => setShowEndPicker(true)}
              >
                <Text
                  className={
                    endDate
                      ? "text-base text-text-bright"
                      : "text-base text-text-muted"
                  }
                >
                  {formatDate(endDate)}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate ?? new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, selected) => {
                    setShowEndPicker(false);
                    if (selected) setEndDate(selected);
                  }}
                />
              )}
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
      </ScrollView>

      <View className="px-4 pb-6 pt-2 bg-background-dark">
        {loading ? (
          <ActivityIndicator size="large" color="#267366" />
        ) : (
          <TouchableOpacity
            className="w-full bg-[#267366] py-4 rounded-xl shadow-lg shadow-[#267366]/20 flex items-center justify-center"
            onPress={handleSaveCampaign}
          >
            <Text className="text-base text-white font-bold">
              Guardar Campaña
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default AddCampaign;
