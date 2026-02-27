import { View, Text, Pressable, Modal, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { CampaignType } from "@/types/campaignTypes";
import { campaignAPI } from "@/services/campaignAPI";
import { router } from "expo-router";
import { RecentActivity } from "@/types/utilTypes";

interface CampaignActiveProps {
  campaign: CampaignType;
  setCampaignActive: (campaign: CampaignType | null) => void;
  lotId: number;
}

function CampaignActive({
  campaign,
  setCampaignActive,
  lotId,
}: CampaignActiveProps) {
  function getTimeAgo(date: Date | string | undefined): string {
    try {
      if (!date) return "Fecha desconocida";

      const now = new Date();
      let activityDate: Date;

      if (typeof date === "object" && date !== null) {
        if (date instanceof Date) {
          activityDate = date;
        } else if ("year" in date || "month" in date) {
          const dateObj = date as any;
          activityDate = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
        } else {
          activityDate = new Date(JSON.stringify(date));
        }
      } else if (typeof date === "string") {
        activityDate = new Date(date);
      } else {
        return "Fecha desconocida";
      }

      if (isNaN(activityDate.getTime())) {
        return "Fecha desconocida";
      }

      // Comparar solo fechas (sin horas)
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const activityDateStart = new Date(
        activityDate.getFullYear(),
        activityDate.getMonth(),
        activityDate.getDate(),
      );

      const diffInMs = todayStart.getTime() - activityDateStart.getTime();
      const diffInDays = Math.floor(diffInMs / 86400000);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInMonths / 12);

      if (diffInDays === 0) return "Hoy";
      if (diffInDays < 30)
        return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`;
      if (diffInMonths < 12)
        return `Hace ${diffInMonths} mes${diffInMonths > 1 ? "es" : ""}`;

      return `Hace ${diffInYears} año${diffInYears > 1 ? "s" : ""}`;
    } catch (error) {
      return "Fecha desconocida";
    }
  }

  function getActivityStyle(activityType: string) {
    switch (activityType) {
      case "sowing":
        return 0;
      case "fertilization":
        return 1;
      case "spraying":
        return 2;
      case "observation":
        return 3;
      case "harvest":
        return 4;
    }
    return 0;
  }

  const activitiesStyle = [
    {
      icon: "grass" as keyof typeof MaterialIcons.glyphMap,
      iconColor: "#22c55e",
      title: "Siembra completada",
    },
    {
      icon: "opacity" as keyof typeof MaterialIcons.glyphMap,
      iconColor: "#3b82f6",
      title: "Fertilización aplicada",
    },
    {
      icon: "science" as keyof typeof MaterialIcons.glyphMap,
      iconColor: "#06b6d4",
      title: "Aplicación de fertilizante",
    },
    {
      icon: "visibility" as keyof typeof MaterialIcons.glyphMap,
      iconColor: "#ef4444",
      title: "Observación registrada",
    },
    {
      icon: "agriculture" as keyof typeof MaterialIcons.glyphMap,
      iconColor: "#f59e0b",
      title: "Cosecha completada",
    },
  ];

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    [],
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [unlinkReason, setUnlinkReason] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeReason, setCompleteReason] = useState("");
  const [completeModalError, setCompleteModalError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchRecentActivities = async () => {
      setIsLoading(true);
      try {
        const activities = await campaignAPI.getRecentActivities(campaign.id);
        setRecentActivities(activities);
      } catch (error) {
        setErrorMsg("Error al cargar las actividades recientes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentActivities();
  }, [campaign.id]);

  const handleCompleteCampaign = () => {
    setCompleteReason("");
    setCompleteModalError(null);
    setShowCompleteModal(true);
  };

  const confirmCompleteCampaign = async () => {
    if (completeReason.trim()) {
      try {
        const res = await campaignAPI.completeCampaign(
          campaign.id,
          completeReason,
        );
        if (res) {
          setShowCompleteModal(false);
          setCompleteModalError(null);
          setCampaignActive(null);
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

  const confirmUnlinkLot = async () => {
    if (unlinkReason.trim()) {
      try {
        const res = await campaignAPI.unlinkLotFromCampaign(
          campaign.id,
          unlinkReason,
          lotId,
        );
        if (res) {
          setShowUnlinkModal(false);
          setModalError(null);
          setCampaignActive(null);
        } else {
          setModalError("Error al desvincular el lote.");
        }
      } catch (error) {
        setModalError("Error al desvincular el lote.");
      }
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
              {isLoading ? (
                <View className="items-center justify-center py-12">
                  <Text className="text-sm text-gray-500 text-center mb-4">
                    Cargando actividades...
                  </Text>
                </View>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => {
                  const style =
                    activitiesStyle[getActivityStyle(activity.type)];
                  return (
                    <View
                      className="flex-row items-start py-3 border-b border-gray-100 dark:border-gray-800"
                      key={index}
                    >
                      <View className="w-10 h-10 rounded-full bg-[#267366]/10 items-center justify-center mr-3">
                        <MaterialIcons
                          name={style.icon}
                          size={20}
                          color={style.iconColor}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="font-semibold text-sm text-black dark:text-white">
                          {style.title}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {activity.description}
                        </Text>
                        <Text className="text-[10px] text-gray-400 mt-1">
                          {getTimeAgo(activity.date)}
                        </Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View className="items-center justify-center py-12">
                  <MaterialIcons
                    name="info-outline"
                    size={40}
                    color="#9ca3af"
                  />
                  <Text className="text-sm text-gray-500 text-center py-6">
                    No hay actividades recientes para mostrar.
                  </Text>
                </View>
              )}
            </View>

            {/* Footer */}
            <Pressable
              className="flex-row items-center justify-between pt-4 mt-2"
              onPress={() =>
                router.push({
                  pathname: `/(tabs)/(register)/(field)/(lots)/(campaigns)/[campaignId]`,
                  params: {
                    campaignId: campaign.id,
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
