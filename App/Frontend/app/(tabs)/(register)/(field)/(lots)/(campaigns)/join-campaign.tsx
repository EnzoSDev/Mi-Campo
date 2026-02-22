import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { fieldAPI } from "@/services/fieldAPI";
import { CampaignType } from "@/types/campaignTypes";
import { useField } from "@/context/FieldContext";

function JoinCampaign() {
  const { lotId } = useLocalSearchParams();
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const fieldId = useField().fieldId;

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsFetching(true);
      try {
        const campaignsData = await fieldAPI.getAllActiveCampaigns(
          Number(fieldId),
        );
        setCampaigns(campaignsData);
      } catch (error) {
        setError("Error al cargar las campañas.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchCampaigns();
  }, [lotId, fieldId]);

  const handleJoinCampaign = async () => {
    setError("");

    if (selectedCampaignId === null) {
      setError("Por favor, selecciona una campaña.");
      return;
    }

    setLoading(true);

    try {
      // Call API to join campaign
      // await fieldAPI.joinCampaign(Number(fieldId), selectedCampaignId);
      router.back();
    } catch (error) {
      setError("Error al unirse a la campaña.");
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
          Unirse a Campaña
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
        {/* Section: Campaigns List */}
        <View className="mb-8">
          <View className="mb-4">
            <Text className="text-sm font-bold uppercase tracking-widest text-primary">
              Campañas Disponibles
            </Text>
            <Text className="text-xs text-text-muted">
              Selecciona una campaña para unirte.
            </Text>
          </View>

          <View className="bg-surface-dark rounded-xl overflow-hidden">
            {isFetching ? (
              <View className="p-6 items-center justify-center">
                <ActivityIndicator size="large" color="#267366" />
                <Text className="text-xs text-text-muted mt-3">
                  Cargando campañas...
                </Text>
              </View>
            ) : !campaigns || campaigns.length === 0 ? (
              <View className="p-6 items-center justify-center">
                <MaterialIcons
                  name="inbox"
                  size={40}
                  color="#96999E"
                  style={{ marginBottom: 8 }}
                />
                <Text className="text-sm text-text-muted text-center">
                  No hay campañas disponibles
                </Text>
              </View>
            ) : (
              campaigns.map((campaign, index) => (
                <TouchableOpacity
                  key={campaign.id}
                  className={`flex-row items-center p-4 ${
                    index !== campaigns.length - 1
                      ? "border-b border-border-dark/50"
                      : ""
                  } ${
                    selectedCampaignId === campaign.id
                      ? "bg-primary/10"
                      : "bg-surface-dark"
                  }`}
                  onPress={() => setSelectedCampaignId(campaign.id)}
                >
                  {/* Radio Button */}
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 ${
                      selectedCampaignId === campaign.id
                        ? "bg-primary border-primary"
                        : "border-border-dark"
                    }`}
                  >
                    {selectedCampaignId === campaign.id && (
                      <View className="w-2 h-2 bg-background-dark rounded-full" />
                    )}
                  </View>

                  {/* Campaign Info */}
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-text-bright">
                      {campaign.campaignName}
                    </Text>
                    <Text className="text-xs text-text-muted mt-1">
                      {new Date(campaign.startDate).toLocaleDateString("es-AR")}{" "}
                      - {new Date(campaign.endDate).toLocaleDateString("es-AR")}
                    </Text>
                    {campaign.description && (
                      <Text className="text-xs text-text-muted mt-2 leading-4">
                        {campaign.description}
                      </Text>
                    )}
                  </View>

                  {/* Right Icon */}
                  <View className="ml-3">
                    <MaterialIcons
                      name="agriculture"
                      size={18}
                      color="#267366"
                    />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <View className="px-4 pb-6 pt-2 bg-background-dark">
        {loading ? (
          <ActivityIndicator size="large" color="#267366" />
        ) : (
          <TouchableOpacity
            className="w-full bg-[#267366] py-4 rounded-xl shadow-lg shadow-[#267366]/20 flex items-center justify-center"
            onPress={handleJoinCampaign}
          >
            <Text className="text-base text-white font-bold">Unirse</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default JoinCampaign;
