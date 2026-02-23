import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CampaignType } from "@/types/campaignTypes";

function CampaignActive({ campaign }: { campaign: CampaignType | null }) {
  return (
    <>
      {campaign ? (
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
              <View className="flex-row items-center justify-between pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
                <Text className="text-[#267366] font-semibold text-sm">
                  Ver todas las actividades
                </Text>
                <MaterialIcons name="chevron-right" size={22} color="#9ca3af" />
              </View>
            </View>
          </View>
        </>
      ) : (
        <View className="px-4 pt-6">
          <View className="bg-white dark:bg-[#16181A] border-2 border-gray-300 dark:border-gray-700 rounded-2xl p-5 items-center">
            <MaterialIcons name="campaign" size={40} color="#9ca3af" />
            <Text className="text-gray-500 mt-3 text-center">
              No hay campañas activas para este lote.
            </Text>
          </View>
        </View>
      )}
    </>
  );
}
export default CampaignActive;
