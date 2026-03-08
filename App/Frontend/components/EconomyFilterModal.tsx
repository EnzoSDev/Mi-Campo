import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ResponseFieldType } from "@/types/fieldTypes";
import { CampaignType } from "@/types/campaignTypes";
import { fieldAPI } from "@/services/fieldAPI";

interface EconomyFilterModalProps {
  handleCloseFilterModal: () => void;
  selectedField: { id: number; fieldName: string } | null;
  setSelectedField: (field: { id: number; fieldName: string } | null) => void;
  selectedCampaign: { id: number; campaignName: string } | null;
  setSelectedCampaign: (
    campaign: { id: number; campaignName: string } | null,
  ) => void;
}

function EconomyFilterModal({
  handleCloseFilterModal,
  selectedField,
  setSelectedField,
  selectedCampaign,
  setSelectedCampaign,
}: EconomyFilterModalProps) {
  const [fields, setFields] = useState<ResponseFieldType[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);
  const [draftSelectedField, setDraftSelectedField] = useState<{
    id: number;
    fieldName: string;
  } | null>(selectedField);
  const [draftSelectedCampaign, setDraftSelectedCampaign] = useState<{
    id: number;
    campaignName: string;
  } | null>(selectedCampaign);
  const [filterError, setFilterError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fields = await fieldAPI.getAllFields();
        setFields(fields);
      } catch (error: any) {
        if (error.message === "SESSION_EXPIRED") {
          setTimeout(() => {
            router.push("/(auth)/login");
          }, 2000);
        } else {
          console.error("Error al obtener los campos:", error);
        }
      }
    };

    fetchFields();
  }, []);

  useEffect(() => {
    if (draftSelectedField) {
      const fetchCampaigns = async (fieldId: number) => {
        try {
          const campaigns = await fieldAPI.getCampaignsByField(fieldId);
          setCampaigns(campaigns);
        } catch (error: any) {
          if (error.message === "SESSION_EXPIRED") {
            setTimeout(() => {
              router.push("/(auth)/login");
            }, 2000);
          } else {
            console.error("Error al obtener las campañas del campo:", error);
          }
        }
      };
      fetchCampaigns(draftSelectedField.id);
    } else {
      setCampaigns([]);
    }
  }, [draftSelectedField]);

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={() => handleCloseFilterModal()}
    >
      <Pressable
        className="flex-1 bg-black/80 justify-center items-center px-4"
        onPress={() => handleCloseFilterModal()}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-[#2d3136] rounded-2xl border border-white/10 w-full max-w-md p-6 gap-4"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white font-bold text-lg">
              Filtrar movimientos
            </Text>
            <Pressable onPress={() => handleCloseFilterModal()}>
              <MaterialIcons name="close" size={24} color="white" />
            </Pressable>
          </View>

          {/* Campo Dropdown */}
          <View>
            <Text className="text-white/60 text-xs font-semibold mb-2">
              CAMPO
            </Text>
            <Pressable
              onPress={() => {
                setShowFieldDropdown((prev) => !prev);
              }}
              className="h-11 px-3 rounded-lg border border-white/10 bg-white/5 flex-row items-center justify-between"
            >
              <Text
                className={`text-sm font-semibold ${
                  draftSelectedField ? "text-white" : "text-white/60"
                }`}
              >
                {draftSelectedField?.fieldName || "Selecciona un campo"}
              </Text>
              <MaterialIcons
                name={
                  showFieldDropdown
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={20}
                color="#94a3b8"
              />
            </Pressable>

            {showFieldDropdown && (
              <View className="mt-2 border border-white/10 bg-[#1A1D20] rounded-lg overflow-hidden max-h-60">
                <ScrollView
                  showsVerticalScrollIndicator={true}
                  persistentScrollbar={true}
                  nestedScrollEnabled={true}
                  bounces={true}
                >
                  {fields.map((field, index) => (
                    <Pressable
                      key={field.id}
                      className={`px-3 py-3 ${
                        index !== fields.length - 1
                          ? "border-b border-white/10"
                          : ""
                      }`}
                      onPress={() => {
                        // Solo resetear campaña si cambias de campo
                        if (draftSelectedField?.id !== field.id) {
                          setDraftSelectedCampaign(null);
                        }
                        setFilterError(null);
                        setDraftSelectedField({
                          id: field.id,
                          fieldName: field.fieldName,
                        });
                        setShowFieldDropdown(false);
                      }}
                    >
                      <Text className="text-white/80 text-sm">
                        {field.fieldName}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Campaña Dropdown */}
          <View>
            <Text className="text-white/60 text-xs font-semibold mb-2">
              CAMPAÑA
            </Text>
            <Pressable
              disabled={!draftSelectedField}
              onPress={() => {
                if (!draftSelectedField) return;
                setShowCampaignDropdown((prev) => !prev);
              }}
              className={`h-11 px-3 rounded-lg border flex-row items-center justify-between ${
                !draftSelectedField
                  ? "border-white/10 bg-white/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  !draftSelectedField
                    ? "text-white/40"
                    : draftSelectedCampaign
                      ? "text-white"
                      : "text-white/60"
                }`}
              >
                {!draftSelectedField
                  ? "Primero selecciona un campo"
                  : draftSelectedCampaign
                    ? draftSelectedCampaign.campaignName
                    : "Selecciona una campaña"}
              </Text>
              <MaterialIcons
                name={
                  showCampaignDropdown
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={20}
                color={draftSelectedField ? "#94a3b8" : "#6b7280"}
              />
            </Pressable>

            {showCampaignDropdown && draftSelectedField && (
              <View className="mt-2 border border-white/10 bg-[#1A1D20] rounded-lg overflow-hidden max-h-60">
                <ScrollView
                  showsVerticalScrollIndicator={true}
                  persistentScrollbar={true}
                  nestedScrollEnabled={true}
                  bounces={true}
                >
                  {campaigns.map((campaign, index) => (
                    <Pressable
                      key={campaign.id}
                      className={`px-3 py-3 ${
                        index !== campaigns.length - 1
                          ? "border-b border-white/10"
                          : ""
                      }`}
                      onPress={() => {
                        setFilterError(null);
                        setDraftSelectedCampaign({
                          id: campaign.id,
                          campaignName: campaign.campaignName,
                        });
                        setShowCampaignDropdown(false);
                      }}
                    >
                      <Text className="text-white/80 text-sm">
                        {campaign.campaignName}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {filterError && (
            <View className="bg-red-500/15 border border-red-500/30 rounded-lg px-3 py-2">
              <Text className="text-red-300 text-xs font-semibold text-center">
                {filterError}
              </Text>
            </View>
          )}

          {/* Botones de acción */}
          <View className="flex-row gap-3 mt-2">
            <Pressable
              className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3"
              onPress={() => {
                setDraftSelectedField(null);
                setDraftSelectedCampaign(null);
                setFilterError(null);
              }}
            >
              <Text className="text-white/80 text-center text-sm font-bold">
                LIMPIAR
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-[#267366] rounded-lg py-3"
              onPress={() => {
                if (!draftSelectedField || !draftSelectedCampaign) {
                  setFilterError("Debes seleccionar un campo y una campaña.");
                  return;
                }

                setFilterError(null);
                setSelectedField(draftSelectedField);
                setSelectedCampaign(draftSelectedCampaign);
                handleCloseFilterModal();
              }}
            >
              <Text className="text-white text-center text-sm font-bold">
                FILTRAR
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default EconomyFilterModal;
