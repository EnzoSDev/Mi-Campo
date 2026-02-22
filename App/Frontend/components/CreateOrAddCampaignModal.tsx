import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface CreateOrAddCampaignModalProps {
  lotId: string;
  handleClose: () => void;
}
function CreateOrAddCampaignModal({
  lotId,
  handleClose,
}: CreateOrAddCampaignModalProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 bg-background-transparent">
      <View className="w-full bg-surface-dark border border-border-dark/50 rounded-2xl p-5">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#267366]/15 items-center justify-center mr-3">
              <MaterialIcons name="campaign" size={20} color="#267366" />
            </View>
            <Text className="text-lg font-bold text-text-bright">
              Campañas del lote
            </Text>
          </View>
          <TouchableOpacity
            accessibilityLabel="Cerrar"
            onPress={handleClose}
            className="w-9 h-9 items-center justify-center rounded-full bg-gray-700/30"
          >
            <MaterialIcons name="close" size={18} color="#E5E7EB" />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-text-muted mb-4">
          ¿Deseas crear una nueva campaña para este lote o unirte a una
          existente?
        </Text>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-[#267366] px-4 py-3 rounded-xl"
            onPress={() =>
              router.push({
                pathname: "./(campaigns)/add-campaign",
                params: { lotId },
              })
            }
          >
            <Text className="text-white font-bold text-center">
              Crear nueva
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-gray-700/40 px-4 py-3 rounded-xl"
            onPress={() =>
              router.push({
                pathname: "./(campaigns)/join-campaign",
                params: { lotId },
              })
            }
          >
            <Text className="text-gray-200 font-bold text-center">
              Unir a existente
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export default CreateOrAddCampaignModal;
