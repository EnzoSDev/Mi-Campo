import { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface EconomyFilterModalProps {
  visible: boolean;
  onClose: () => void;
  fieldOptions: string[];
  campaignOptions: string[];
  selectedField: string | null;
  selectedCampaign: string | null;
  onFieldSelect: (field: string | null) => void;
  onCampaignSelect: (campaign: string | null) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

function EconomyFilterModal({
  visible,
  onClose,
  fieldOptions,
  campaignOptions,
  selectedField,
  selectedCampaign,
  onFieldSelect,
  onCampaignSelect,
  onApplyFilter,
  onClearFilter,
}: EconomyFilterModalProps) {
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false);
  const [isCampaignDropdownOpen, setIsCampaignDropdownOpen] = useState(false);

  const handleFieldSelect = (field: string | null) => {
    onFieldSelect(field);
    setIsFieldDropdownOpen(false);
    setIsCampaignDropdownOpen(false);
  };

  const handleCampaignSelect = (campaign: string | null) => {
    onCampaignSelect(campaign);
    setIsCampaignDropdownOpen(false);
  };

  const handleClear = () => {
    onClearFilter();
    setIsFieldDropdownOpen(false);
    setIsCampaignDropdownOpen(false);
  };

  const handleApply = () => {
    onApplyFilter();
    setIsFieldDropdownOpen(false);
    setIsCampaignDropdownOpen(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/80 justify-center items-center px-4"
        onPress={onClose}
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
            <Pressable onPress={onClose}>
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
                setIsFieldDropdownOpen((prev) => !prev);
                setIsCampaignDropdownOpen(false);
              }}
              className="h-11 px-3 rounded-lg border border-white/10 bg-white/5 flex-row items-center justify-between"
            >
              <Text
                className={`text-sm font-semibold ${
                  selectedField ? "text-white" : "text-white/60"
                }`}
              >
                {selectedField || "Todos"}
              </Text>
              <MaterialIcons
                name={
                  isFieldDropdownOpen
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={20}
                color="#94a3b8"
              />
            </Pressable>

            {isFieldDropdownOpen && (
              <View className="mt-2 border border-white/10 bg-[#1A1D20] rounded-lg overflow-hidden max-h-48">
                <ScrollView>
                  <Pressable
                    onPress={() => handleFieldSelect(null)}
                    className="px-3 py-3 border-b border-white/10"
                  >
                    <Text className="text-white/80 text-sm">Todos</Text>
                  </Pressable>

                  {fieldOptions.map((field, index) => (
                    <Pressable
                      key={field}
                      onPress={() => handleFieldSelect(field)}
                      className={`px-3 py-3 ${
                        index !== fieldOptions.length - 1
                          ? "border-b border-white/10"
                          : ""
                      }`}
                    >
                      <Text className="text-white/80 text-sm">{field}</Text>
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
              disabled={!selectedField}
              onPress={() => {
                if (!selectedField) return;
                setIsCampaignDropdownOpen((prev) => !prev);
                setIsFieldDropdownOpen(false);
              }}
              className={`h-11 px-3 rounded-lg border flex-row items-center justify-between ${
                !selectedField
                  ? "border-white/10 bg-white/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  !selectedField
                    ? "text-white/40"
                    : selectedCampaign
                      ? "text-white"
                      : "text-white/60"
                }`}
              >
                {!selectedField
                  ? "Primero selecciona un campo"
                  : selectedCampaign || "Todas"}
              </Text>
              <MaterialIcons
                name={
                  isCampaignDropdownOpen
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={20}
                color={selectedField ? "#94a3b8" : "#6b7280"}
              />
            </Pressable>

            {isCampaignDropdownOpen && selectedField && (
              <View className="mt-2 border border-white/10 bg-[#1A1D20] rounded-lg overflow-hidden max-h-48">
                <ScrollView>
                  <Pressable
                    onPress={() => handleCampaignSelect(null)}
                    className="px-3 py-3 border-b border-white/10"
                  >
                    <Text className="text-white/80 text-sm">Todas</Text>
                  </Pressable>

                  {campaignOptions.map((campaign, index) => (
                    <Pressable
                      key={campaign}
                      onPress={() => handleCampaignSelect(campaign)}
                      className={`px-3 py-3 ${
                        index !== campaignOptions.length - 1
                          ? "border-b border-white/10"
                          : ""
                      }`}
                    >
                      <Text className="text-white/80 text-sm">{campaign}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Botones de acción */}
          <View className="flex-row gap-3 mt-2">
            <Pressable
              onPress={handleClear}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3"
            >
              <Text className="text-white/80 text-center text-sm font-bold">
                LIMPIAR
              </Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              className="flex-1 bg-[#267366] rounded-lg py-3"
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
