import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

function Campaign() {
  const { campaignId, campaignName, startDate, endDate, status } =
    useLocalSearchParams();

  const parseDate = (value?: string | string[]) => {
    if (!value) return null;
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatShortDate = (value: Date | null) => {
    if (!value) return "-";
    return value.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const options = [
    {
      key: "sowing",
      label: "Siembra",
      icon: "grass" as keyof typeof MaterialIcons.glyphMap,
      route: "./sowing" as const,
      bg: "bg-green-500/20",
      iconColor: "#22c55e",
    },
    {
      key: "fertilizations",
      label: "Fertilizaciones",
      icon: "opacity" as keyof typeof MaterialIcons.glyphMap,
      route:
        "/(tabs)/(register)/(field)/(lots)/(campaigns)/fertilizations" as const,
      bg: "bg-blue-500/20",
      iconColor: "#3b82f6",
    },
    {
      key: "pulverizations",
      label: "Pulverizaciones",
      icon: "water-drop" as keyof typeof MaterialIcons.glyphMap,
      route:
        "/(tabs)/(register)/(field)/(lots)/(campaigns)/pulverizations" as const,
      bg: "bg-cyan-500/20",
      iconColor: "#06b6d4",
    },
    {
      key: "harvest",
      label: "Cosecha",
      icon: "agriculture" as keyof typeof MaterialIcons.glyphMap,
      route: "/(tabs)/(register)/(field)/(lots)/(campaigns)/harvest" as const,
      bg: "bg-amber-500/20",
      iconColor: "#f59e0b",
    },
    {
      key: "observations",
      label: "Observaciones",
      icon: "visibility" as keyof typeof MaterialIcons.glyphMap,
      route:
        "/(tabs)/(register)/(field)/(lots)/(campaigns)/observations" as const,
      bg: "bg-red-500/20",
      iconColor: "#ef4444",
    },
  ] as const;

  return (
    <View className="flex-1 bg-[#0F1113]">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-white/10">
        <Pressable className="p-1" onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color="#3FA39B" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-[15px] font-bold text-white">
            {campaignName}
          </Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <View className="w-1.5 h-1.5 rounded-full bg-[#3FA39B]" />
            <Text className="text-[9px] uppercase tracking-[1px] text-[#3FA39B] font-semibold">
              {status === "active" ? "Activa" : "Completada"}
            </Text>
          </View>
        </View>
        <View className="w-8" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-5">
          <View className="bg-[#16181A] border border-white/10 rounded-2xl p-5">
            <View className="flex-row gap-4">
              <View className="flex-1">
                <View className="flex-row items-center gap-1 mb-1">
                  <MaterialIcons name="flag" size={12} color="#9ca3af" />
                  <Text className="text-[10px] text-white/50 uppercase tracking-wider">
                    Inicio
                  </Text>
                </View>
                <Text className="text-sm font-medium text-white">
                  {formatShortDate(start)}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1 mb-1">
                  <MaterialIcons name="event" size={12} color="#9ca3af" />
                  <Text className="text-[10px] text-white/50 uppercase tracking-wider">
                    Fin est.
                  </Text>
                </View>
                <Text className="text-sm font-medium text-white">
                  {formatShortDate(end)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 pt-6">
          <Text className="text-[10px] font-bold tracking-widest text-white/50 mb-3 uppercase">
            Actividades
          </Text>
          <View className="flex-row flex-wrap gap-4 justify-center">
            {options.map((option, index) => {
              const isLastOdd =
                options.length % 2 === 1 && index === options.length - 1;
              return (
                <Pressable
                  key={`campaign-${option.key}`}
                  className={`${
                    isLastOdd ? "w-full" : "w-[48%]"
                  }  ${option.bg} border border-white/10 rounded-2xl p-4 py-12 items-center justify-center active:opacity-80`}
                  onPress={() =>
                    router.push({
                      pathname: option.route as any,
                      params: { campaignId },
                    })
                  }
                >
                  <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center mb-2">
                    <MaterialIcons
                      name={option.icon}
                      size={20}
                      color={option.iconColor}
                    />
                  </View>
                  <View className="w-full items-center">
                    <Text className="text-[13px] font-semibold text-white text-center leading-4">
                      {option.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Campaign;
