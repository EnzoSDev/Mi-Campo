import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import LotCard from "@/components/LotCard";
import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { lotAPI } from "@/services/lotAPI";
import { ResponseLotType } from "@/types/fieldTypes";
import { useField } from "@/context/FieldContext";

function Lots() {
  const [lots, setLots] = useState<ResponseLotType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fieldId = useField().fieldId;

  useEffect(() => {
    const fetchLots = async () => {
      setIsLoading(true);
      try {
        const data = await lotAPI.getAllLots(Number(fieldId));
        setLots(data);
      } catch (error) {
        console.error("Error al obtener los lotes:", error);
        setErrorMsg("Error al obtener los lotes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLots();
  }, [fieldId]);

  const handleAddLot = () => {
    router.push({
      pathname: "./(lots)/add-lot",
      params: { fieldId },
    });
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas borrar este lote?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            try {
              await lotAPI.deleteLot(id);
              setLots((prevLots) => prevLots.filter((lot) => lot.id !== id));
              setErrorMsg(null);
            } catch (error) {
              console.error(error);
              setErrorMsg("Error al borrar el lote.");
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4 text-white">Mis Lotes</Text>
      {errorMsg && (
        <View className="mb-4 rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-3">
          <Text className="text-red-300 text-sm font-semibold">{errorMsg}</Text>
        </View>
      )}
      <FlatList
        data={lots}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-8">
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color="#94a3b8" />
                <Text className="mt-3 text-center text-[#94a3b8] px-4">
                  Cargando lotes...
                </Text>
              </>
            ) : (
              <Text className="text-center text-[#64748b] dark:text-[#94a3b8] px-4">
                No hay lotes disponibles.
              </Text>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <LotCard
            id={item.id}
            lotName={item.lotName}
            areaHa={item.areaHa}
            description={item.description}
            handleDelete={handleDelete}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96, gap: 16 }}
      />

      <Pressable
        onPress={handleAddLot}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#267366] items-center justify-center shadow-lg"
      >
        <MaterialIcons name="add" size={28} color="white" />
      </Pressable>
    </View>
  );
}

export default Lots;
