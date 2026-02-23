import { ScrollView, Text, View, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import AddSowingModal from "@/components/AddSowingModal";

const sowingRecords = [
  {
    id: "SN-2023-012",
    title: "North Field - Sector A",
    crop_type: "Maiz",
    variety: "P1197",
    sowing_date: "2023-10-12",
    density: 8,
    row_spacing: 0.52,
    method: "Directa",
    status: "completed",
  },
  {
    id: "SN-2023-015",
    title: "South Valley - Lot 4",
    crop_type: "Soja",
    variety: "AG36",
    sowing_date: "2023-10-10",
    density: 10,
    row_spacing: 0.7,
    method: "Convencional",
    status: "in-progress",
  },
  {
    id: "SN-2023-018",
    title: "East Ridge - Block B",
    crop_type: "Trigo",
    variety: "Skyfall",
    sowing_date: "2023-10-08",
    density: 7,
    row_spacing: 0.35,
    method: "Directa",
    status: "completed",
  },
];

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Sowing() {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <View className="flex-1 bg-[#0F1113]">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-white/10">
        <Pressable className="p-1" onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color="#3FA39B" />
        </Pressable>
        <Text className="text-lg font-bold text-white">
          Registros de siembra
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      >
        <View className="gap-5">
          {sowingRecords.map((record) => (
            <View
              key={record.id}
              className="relative overflow-hidden bg-[#141618] border border-white/10 rounded-3xl p-5"
            >
              <View
                className={"absolute inset-x-0 top-0 h-1 bg-emerald-500/60"}
              />

              <View className="flex-row items-start justify-center mb-4">
                <Text className="text-base font-bold text-white">
                  {record.title}
                </Text>
              </View>

              <View className="flex-row items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3 mb-4">
                <View>
                  <Text className="text-[10px] uppercase tracking-wider text-white/50">
                    Fecha de siembra
                  </Text>
                  <Text className="text-sm font-semibold text-white mt-1">
                    {formatDate(record.sowing_date)}
                  </Text>
                </View>
                <View className="w-9 h-9 rounded-xl bg-white/10 items-center justify-center">
                  <MaterialIcons name="event" size={18} color="#9CA3AF" />
                </View>
              </View>

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3">
                  <Text className="text-[10px] uppercase tracking-wider text-white/50">
                    Cultivo
                  </Text>
                  <Text className="text-sm font-semibold text-white mt-1">
                    {record.crop_type}
                  </Text>
                </View>
                <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3">
                  <Text className="text-[10px] uppercase tracking-wider text-white/50">
                    Variedad
                  </Text>
                  <Text className="text-sm font-semibold text-white mt-1">
                    {record.variety}
                  </Text>
                </View>
              </View>

              <View className="border-t border-white/10 pt-4">
                <View className="flex-row flex-wrap gap-3">
                  <View className="w-[48%] bg-white/5 border border-white/10 rounded-2xl p-3">
                    <View className="flex-row items-center gap-1 mb-1">
                      <MaterialIcons
                        name="view-module"
                        size={14}
                        color="#94A3B8"
                      />
                      <Text className="text-[10px] font-semibold uppercase tracking-tight text-white/50">
                        Densidad
                      </Text>
                    </View>
                    <Text className="text-sm font-medium text-white">
                      {record.density}
                    </Text>
                  </View>
                  <View className="w-[48%] bg-white/5 border border-white/10 rounded-2xl p-3">
                    <View className="flex-row items-center gap-1 mb-1">
                      <MaterialIcons
                        name="straighten"
                        size={14}
                        color="#94A3B8"
                      />
                      <Text className="text-[10px] font-semibold uppercase tracking-tight text-white/50">
                        Distancia
                      </Text>
                    </View>
                    <Text className="text-sm font-medium text-white">
                      {record.row_spacing} m
                    </Text>
                  </View>
                  <View className="w-[48%] bg-white/5 border border-white/10 rounded-2xl p-3">
                    <View className="flex-row items-center gap-1 mb-1">
                      <MaterialIcons name="build" size={14} color="#94A3B8" />
                      <Text className="text-[10px] font-semibold uppercase tracking-tight text-white/50">
                        Metodo
                      </Text>
                    </View>
                    <Text className="text-sm font-medium text-white">
                      {record.method}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#267366] items-center justify-center shadow-lg active:opacity-80"
        onPress={() => setShowAddModal(true)}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </Pressable>

      {showAddModal && <AddSowingModal setShowAddModal={setShowAddModal} />}
    </View>
  );
}

export default Sowing;
