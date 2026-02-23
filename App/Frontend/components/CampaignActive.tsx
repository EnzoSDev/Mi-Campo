import { View, Text, Pressable, Alert, Modal, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { CampaignType } from "@/types/campaignTypes";
import { campaignAPI } from "@/services/campaignAPI";
import { router } from "expo-router";

interface CampaignActiveProps {
  campaign: CampaignType;
  setCampaignActive: (campaign: CampaignType | null) => void;
}

function CampaignActive({ campaign, setCampaignActive }: CampaignActiveProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [unlinkReason, setUnlinkReason] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeReason, setCompleteReason] = useState("");
  const [completeModalError, setCompleteModalError] = useState<string | null>(
    null,
  );

  const handleCompleteCampaign = () => {
    setCompleteReason("");
    setCompleteModalError(null);
    setShowCompleteModal(true);
  };

  const confirmCompleteCampaign = async () => {
    if (completeReason.trim()) {
      try {
        const res = await campaignAPI.completeCampaign(campaign.id);
        if (res) {
          setShowCompleteModal(false);
          setCompleteModalError(null);
          setCampaignActive(null);
          // TODO: Guardar el motivo de finalización en la tabla observaciones de la campaña
          console.log("Motivo de finalización:", completeReason);
        } else {
          setCompleteModalError("Error al finalizar la campaña.");
        }
      } catch (error) {
        setCompleteModalError("Error al finalizar la campaña.");
      }
    } else {
      setCompleteModalError("Debes ingresar un motivo para finalizar");
    }
  };

  const handleUnlinkLot = () => {
    setUnlinkReason("");
    setModalError(null);
    setShowUnlinkModal(true);
  };

  const confirmUnlinkLot = () => {
    if (unlinkReason.trim()) {
      // TODO: Implementar lógica para desvincular lote con el motivo
      console.log("Motivo:", unlinkReason);
      setShowUnlinkModal(false);
      setModalError(null);
    } else {
      setModalError("Debes ingresar un motivo para desvincular");
    }
  };

  return (
    <>
      {errorMsg && (
        <View className="mx-4 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex-row items-center gap-3">
          <MaterialIcons name="error-outline" size={20} color="#ef4444" />
          <Text className="flex-1 text-red-700 dark:text-red-300 text-sm font-medium">
            {errorMsg}
          </Text>
          <Pressable onPress={() => setErrorMsg(null)}>
            <MaterialIcons name="close" size={18} color="#ef4444" />
          </Pressable>
        </View>
      )}
      <>
        {/* RECENT ACTIVITY */}
        <View className="px-4 pt-6">
          <View className="bg-white dark:bg-[#16181A] border-2 border-[#267366] rounded-2xl p-5">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-lg font-bold text-black dark:text-white">
                  {campaign?.campaignName || "Campaña 2023/2024"}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Actividad reciente
                </Text>
              </View>

              <View className="bg-[#759154]/20 px-3 py-1 rounded-full">
                <Text className="text-[10px] font-bold text-[#759154]">
                  ACTIVA
                </Text>
              </View>
            </View>

            {/* Activity List */}
            <View className="space-y-3">
              {/* Activity Item 1 */}
              <View className="flex-row items-start py-3 border-b border-gray-100 dark:border-gray-800">
                <View className="w-10 h-10 rounded-full bg-[#267366]/10 items-center justify-center mr-3">
                  <MaterialIcons name="grass" size={20} color="#267366" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-sm text-black dark:text-white">
                    Siembra completada
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Soja • Potrero A3 • 45.5 ha
                  </Text>
                  <Text className="text-[10px] text-gray-400 mt-1">
                    hace 2 días
                  </Text>
                </View>
              </View>

              {/* Activity Item 2 */}
              <View className="flex-row items-start py-3 border-b border-gray-100 dark:border-gray-800">
                <View className="w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center mr-3">
                  <MaterialIcons name="opacity" size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-sm text-black dark:text-white">
                    Riego aplicado
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Potrero B1 • 30mm
                  </Text>
                  <Text className="text-[10px] text-gray-400 mt-1">
                    hace 5 días
                  </Text>
                </View>
              </View>

              {/* Activity Item 3 */}
              <View className="flex-row items-start py-3 border-b border-gray-100 dark:border-gray-800">
                <View className="w-10 h-10 rounded-full bg-amber-500/10 items-center justify-center mr-3">
                  <MaterialIcons name="science" size={20} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-sm text-black dark:text-white">
                    Aplicación de fertilizante
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    NPK 15-15-15 • Potrero A2 • 200 kg/ha
                  </Text>
                  <Text className="text-[10px] text-gray-400 mt-1">
                    hace 1 semana
                  </Text>
                </View>
              </View>

              {/* Activity Item 4 */}
              <View className="flex-row items-start py-3">
                <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center mr-3">
                  <MaterialIcons
                    name="pest-control"
                    size={20}
                    color="#ef4444"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-sm text-black dark:text-white">
                    Control de plagas
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Herbicida • Múltiples potreros
                  </Text>
                  <Text className="text-[10px] text-gray-400 mt-1">
                    hace 2 semanas
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer */}
            <Pressable
              className="flex-row items-center justify-between pt-4 mt-2 border-t border-gray-200 dark:border-gray-800"
              onPress={() =>
                router.push({
                  pathname: `/(tabs)/(register)/(field)/(lots)/(campaigns)/${campaign.id}`,
                  params: {
                    campaignName: campaign.campaignName,
                    startDate: String(campaign.startDate),
                    endDate: String(campaign.endDate),
                    status: "active",
                  },
                })
              }
            >
              <Text className="text-[#267366] font-semibold text-sm">
                Ver todas las actividades
              </Text>
              <MaterialIcons name="chevron-right" size={22} color="#9ca3af" />
            </Pressable>

            {/* Botón Desvincular Lote */}
            <Pressable
              onPress={handleUnlinkLot}
              className="mt-4 bg-gray-600 rounded-lg py-3 items-center active:opacity-80"
            >
              <Text className="text-white font-bold text-sm">
                Desvincular lote de la campaña
              </Text>
            </Pressable>

            {/* Botón Completar Campaña */}
            <Pressable
              onPress={handleCompleteCampaign}
              className="mt-4 bg-[#267366] rounded-lg py-3 items-center active:opacity-80"
            >
              <Text className="text-white font-bold text-sm">
                Finalizar Campaña
              </Text>
            </Pressable>
          </View>
        </View>
      </>

      {/* Modal Desvincular Lote */}
      <Modal
        visible={showUnlinkModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUnlinkModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/90">
          <View className="bg-white dark:bg-[#16181A] rounded-2xl p-6 mx-4 w-11/12 max-w-md">
            <Text className="text-xl font-bold text-black dark:text-white mb-2">
              Desvincular Lote
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Ingresa el motivo de la desvinculación:
            </Text>

            {modalError && (
              <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex-row items-center gap-2 mb-3">
                <MaterialIcons name="error-outline" size={18} color="#ef4444" />
                <Text className="flex-1 text-red-700 dark:text-red-300 text-xs font-medium">
                  {modalError}
                </Text>
                <Pressable onPress={() => setModalError(null)}>
                  <MaterialIcons name="close" size={16} color="#ef4444" />
                </Pressable>
              </View>
            )}

            <TextInput
              value={unlinkReason}
              onChangeText={setUnlinkReason}
              placeholder="Ej: Cambio de plan de siembra"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-black dark:text-white mb-4 min-h-[80px]"
              style={{ textAlignVertical: "top" }}
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowUnlinkModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg py-3 items-center"
              >
                <Text className="text-gray-800 dark:text-gray-200 font-semibold">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmUnlinkLot}
                className="flex-1 bg-red-500 rounded-lg py-3 items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Desvincular</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Finalizar Campaña */}
      <Modal
        visible={showCompleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/90">
          <View className="bg-white dark:bg-[#16181A] rounded-2xl p-6 mx-4 w-11/12 max-w-md">
            <Text className="text-xl font-bold text-black dark:text-white mb-2">
              Finalizar Campaña
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Ingresa el motivo de la finalización:
            </Text>

            {completeModalError && (
              <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex-row items-center gap-2 mb-3">
                <MaterialIcons name="error-outline" size={18} color="#ef4444" />
                <Text className="flex-1 text-red-700 dark:text-red-300 text-xs font-medium">
                  {completeModalError}
                </Text>
                <Pressable onPress={() => setCompleteModalError(null)}>
                  <MaterialIcons name="close" size={16} color="#ef4444" />
                </Pressable>
              </View>
            )}

            <TextInput
              value={completeReason}
              onChangeText={setCompleteReason}
              placeholder="Ej: Cosecha completada exitosamente"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-black dark:text-white mb-4 min-h-[80px]"
              style={{ textAlignVertical: "top" }}
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowCompleteModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg py-3 items-center"
              >
                <Text className="text-gray-800 dark:text-gray-200 font-semibold">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmCompleteCampaign}
                className="flex-1 bg-[#267366] rounded-lg py-3 items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Finalizar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
export default CampaignActive;
