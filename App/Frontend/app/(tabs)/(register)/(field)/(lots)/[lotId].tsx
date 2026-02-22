import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import CampaignActive from "@/components/CampaignActive";
import { lotAPI } from "@/services/lotAPI";
import NewCampaignModal from "@/components/CreateOrAddCampaignModal";

function Lot() {
  const { lotId, lotName } = useLocalSearchParams();
  const [campaignActive, setCampaignActive] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);

  useEffect(() => {
    const fetchActiveCampaign = async () => {
      try {
        const res = await lotAPI.getCampaignActive(Number(lotId));
        setCampaignActive(res);
      } catch (error) {
        console.error("Error fetching active campaign:", error);
      }
    };
    fetchActiveCampaign();
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
        <CampaignActive />

        <View className="px-4 pt-8">
          <Text className="text-[10px] font-bold tracking-widest text-gray-500 mb-3 uppercase">
            CAMPAÑAS ANTERIORES
          </Text>

          {[
            { year: "Campaña 2022/2023", ha: "445.8 ha" },
            { year: "Campaña 2021/2022", ha: "412.0 ha" },
            { year: "Campaña 2020/2021", ha: "398.5 ha" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white dark:bg-[#16181A] border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-3 flex-row items-center justify-between shadow-sm"
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
                    {item.year}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-[10px] font-bold uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded">
                      Completada
                    </Text>
                    <Text className="text-[10px] text-gray-500 ml-2">
                      • {item.ha}
                    </Text>
                  </View>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>
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
