import {
  ScrollView,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import AddSprayingModal from "@/components/AddSprayingModal";
import { SprayingType } from "@/types/campaignTypes";
import { campaignAPI } from "@/services/campaignAPI";

const formatDate = (value: Date) => {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

function Spraying() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [sprayings, setSprayings] = useState<SprayingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { campaignId } = useLocalSearchParams();

  useEffect(() => {
    const fetchSprayings = async () => {
      try {
        setLoading(true);
        setError("");
        const sprayings = await campaignAPI.getSprayingsByCampaign(
          Number(campaignId),
        );
        setSprayings(sprayings);
      } catch (error: any) {
        setError("Error al cargar los registros de pulverización");
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchSprayings();
    }
  }, [campaignId]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError("");
      const sprayings = await campaignAPI.getSprayingsByCampaign(
        Number(campaignId),
      );
      setSprayings(sprayings);
    } catch (error: any) {
      setError("Error al cargar los registros de pulverización");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0F1113]">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-white/10">
        <Pressable className="p-1" onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color="#3FA39B" />
        </Pressable>
        <Text className="text-lg font-bold text-white">
          Registros de Pulverización
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3FA39B" />
            <Text className="text-white/70 mt-4 text-center">
              Cargando registros de pulverización...
            </Text>
          </View>
        ) : error ? (
          <View className="py-6">
            <View className="mx-0 p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
              <View className="flex-row items-start">
                <MaterialIcons name="error-outline" size={20} color="#ef4444" />
                <View className="flex-1 ml-3">
                  <Text className="text-sm text-red-300 font-semibold mb-2">
                    Error al cargar
                  </Text>
                  <Text className="text-sm text-red-300/90 leading-5">
                    {String(error)}
                  </Text>
                </View>
              </View>
            </View>
            <Pressable
              className="mt-4 bg-[#3FA39B] py-3 rounded-xl items-center"
              onPress={refetch}
            >
              <Text className="text-[#0F1113] font-semibold">Reintentar</Text>
            </Pressable>
          </View>
        ) : sprayings.length === 0 ? (
          <View className="py-10 items-center">
            <MaterialIcons name="info-outline" size={48} color="#3FA39B" />
            <Text className="text-white/70 mt-4 text-center text-base">
              Sin registros de pulverización
            </Text>
            <Text className="text-white/50 mt-2 text-center text-sm">
              Crea un nuevo registro usando el botón de agregar
            </Text>
          </View>
        ) : (
          <View className="gap-5">
            {sprayings.map((record) => (
              <View
                key={record.id}
                className="relative overflow-hidden bg-[#141618] border border-white/10 rounded-3xl p-5"
              >
                <View
                  className={"absolute inset-x-0 top-0 h-1 bg-purple-500/60"}
                />

                <View className="flex-row items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3 mb-4">
                  <View>
                    <Text className="text-[10px] uppercase tracking-wider text-white/50">
                      Fecha de aplicación
                    </Text>
                    <Text className="text-sm font-semibold text-white mt-1">
                      {formatDate(record.dateApplied)}
                    </Text>
                  </View>
                  <View className="w-9 h-9 rounded-xl bg-white/10 items-center justify-center">
                    <MaterialIcons name="event" size={18} color="#9CA3AF" />
                  </View>
                </View>

                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3">
                    <Text className="text-[10px] uppercase tracking-wider text-white/50">
                      Producto
                    </Text>
                    <Text className="text-sm font-semibold text-white mt-1">
                      {record.productName}
                    </Text>
                  </View>
                  <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3">
                    <Text className="text-[10px] uppercase tracking-wider text-white/50">
                      Dosis
                    </Text>
                    <Text className="text-sm font-semibold text-white mt-1">
                      {record.dose} L/ha
                    </Text>
                  </View>
                </View>

                <View className="border-t border-white/10 pt-4">
                  <View className="flex-row flex-wrap gap-3">
                    <View className="w-[48%] bg-white/5 border border-white/10 rounded-2xl p-3">
                      <View className="flex-row items-center gap-1 mb-1">
                        <MaterialIcons
                          name="track-changes"
                          size={14}
                          color="#94A3B8"
                        />
                        <Text className="text-[10px] font-semibold uppercase tracking-tight text-white/50">
                          Objetivo
                        </Text>
                      </View>
                      <Text className="text-sm font-medium text-white">
                        {record.target}
                      </Text>
                    </View>
                    <View className="w-[48%] bg-white/5 border border-white/10 rounded-2xl p-3">
                      <View className="flex-row items-center gap-1 mb-1">
                        <MaterialIcons name="build" size={14} color="#94A3B8" />
                        <Text className="text-[10px] font-semibold uppercase tracking-tight text-white/50">
                          Método
                        </Text>
                      </View>
                      <Text className="text-sm font-medium text-white">
                        {record.method}
                      </Text>
                    </View>
                  </View>
                </View>

                {record.notes && (
                  <View className="border-t border-white/10 pt-4 mt-4">
                    <View className="flex-row items-start gap-2 bg-white/5 border border-white/10 rounded-2xl p-3">
                      <MaterialIcons
                        name="notes"
                        size={16}
                        color="#3FA39B"
                        style={{ marginTop: 2 }}
                      />
                      <View className="flex-1">
                        <Text className="text-[10px] font-semibold uppercase tracking-tight text-white/50 mb-1">
                          Notas
                        </Text>
                        <Text className="text-sm text-white/80 leading-5">
                          {record.notes}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#267366] items-center justify-center shadow-lg active:opacity-80"
        onPress={() => setShowAddModal(true)}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </Pressable>

      {showAddModal && <AddSprayingModal setShowAddModal={setShowAddModal} />}
    </View>
  );
}

export default Spraying;
