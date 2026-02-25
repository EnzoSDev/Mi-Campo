import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import CampaignActive from "@/components/CampaignActive";
import { lotAPI } from "@/services/lotAPI";
import NewCampaignModal from "@/components/CreateOrAddCampaignModal";
import { CampaignType } from "@/types/campaignTypes";

function Lot() {
  const { lotId, lotName } = useLocalSearchParams();
  const [campaignActive, setCampaignActive] = useState<CampaignType | null>(
    null,
  );
  const [campaignsCompleted, setCampaignsCompleted] = useState<CampaignType[]>(
    [],
  );
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [activeCampaign, completedCampaigns] = await Promise.all([
          lotAPI.getCampaignActive(Number(lotId)),
          lotAPI.getCampaignsCompleted(Number(lotId)),
        ]);
        setCampaignActive(activeCampaign);
        setCampaignsCompleted(completedCampaigns);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [lotId]);

  return (
    <View className="flex-1 bg-white dark:bg-[#0F1113]">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="p-1" onPress={() => router.back()}>
            <MaterialIcons name="chevron-left" size={28} color="#267366" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black dark:text-white">
            {lotName}
          </Text>
        </View>
      </View>

      {/* CONTENIDO SCROLLABLE */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#267366" />
          </View>
        ) : (
          <>
            {campaignActive ? (
              <CampaignActive
                campaign={campaignActive}
                setCampaignActive={setCampaignActive}
                lotId={Number(lotId)}
              />
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
            <View className="px-4 pt-8">
              <Text className="text-[10px] font-bold tracking-widest text-gray-500 mb-3 uppercase">
                CAMPAÑAS ANTERIORES
              </Text>

              {campaignsCompleted && campaignsCompleted.length > 0 ? (
                campaignsCompleted.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-white dark:bg-[#16181A] border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-3 flex-row items-center justify-between shadow-sm"
                    onPress={() => {
                      router.push({
                        pathname:
                          `/(tabs)/(register)/(field)/(lots)/(campaigns)/${item.id}` as any,
                        params: {
                          campaignName: item.campaignName,
                          startDate: String(item.startDate),
                          endDate: String(item.endDate),
                          status: "completed",
                        },
                      });
                    }}
                  >
                    <View className="flex-row items-center gap-4">
                      <View className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center">
                        <MaterialIcons
                          name="calendar-today"
                          size={18}
                          color="#9ca3af"
                        />
                      </View>
                      <View>
                        <Text className="font-bold text-sm text-black dark:text-white">
                          {item.campaignName}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <Text className="text-[10px] font-bold uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded">
                            Completada
                          </Text>
                          <Text className="text-[10px] text-gray-500 ml-2">
                            Finalizada el{" "}
                            {new Date(item.endDate).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <View className="items-center py-10">
                  <MaterialIcons name="history" size={40} color="#94a3b8" />
                  <Text className="text-gray-500 mt-4">
                    No hay campañas anteriores para este lote.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* BOTÓN FLOTANTE (FAB) */}
      <Pressable
        onPress={() => setShowNewCampaignModal(true)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#267366] items-center justify-center shadow-lg active:opacity-80"
      >
        <MaterialIcons name="add" size={28} color="white" />
      </Pressable>

      {/* MODAL SIMULADO (Se renderiza sobre el contenido sin mover los botones del sistema) */}
      {showNewCampaignModal && (
        <View className="absolute inset-0 z-50 bg-black/90">
          <NewCampaignModal
            lotId={lotId as string}
            handleClose={() => setShowNewCampaignModal(false)}
          />
        </View>
      )}
    </View>
  );
}

export default Lot;
