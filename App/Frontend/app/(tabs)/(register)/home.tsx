import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { router } from "expo-router";

// Services
import { fieldAPI } from "../../../services/fieldAPI";
import type { ResponseFieldType } from "@/types/fieldTypes";

// Components
import FieldCard from "../../../components/FieldCard";

export default function Home() {
  const [fields, setFields] = useState<ResponseFieldType[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const data = await fieldAPI.getAllFields();
        setFields(data);
        setErrorMsg(null);
      } catch (error) {
        console.error(error);
        setErrorMsg("Error al cargar los campos.");
      }
    };

    fetchFields();
  }, []);

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas borrar este campo?",
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
              await fieldAPI.deleteField(id);
              setFields((prevFields) =>
                prevFields.filter((field) => field.id !== id),
              );
              setErrorMsg(null);
            } catch (error) {
              console.error(error);
              setErrorMsg("Error al borrar el campo.");
            }
          },
        },
      ],
    );
  };

  const renderHeader = () => (
    <>
      {/* Headline Section */}
      <View className="px-4 pt-8 pb-2">
        <Text className="text-[#0f172a] dark:text-white text-[32px] font-bold leading-tight">
          ¡Bienvenido de nuevo!
        </Text>
        <Text className="text-[#64748b] dark:text-[#94a3b8] text-base mt-1">
          Maneja tus campos de manera eficiente y sostenible
        </Text>
      </View>

      {/* Search and Add Bar */}
      <View className="px-4 py-6">
        <View className="flex-row gap-3">
          <View className="flex-1 h-12 flex-row items-center bg-white dark:bg-[#2d3136] rounded-xl">
            <View className="pl-4">
              <MaterialIcons name="search" size={20} color="#94a3b8" />
            </View>
            <TextInput
              className="flex-1 px-2 text-[#0f172a] dark:text-white"
              placeholder="Buscar campo..."
              placeholderTextColor="#94a3b8"
            />
          </View>
          <TouchableOpacity
            className="w-12 h-12 rounded-xl bg-[#267366] items-center justify-center"
            onPress={() => router.push("/(tabs)/(register)/add-field")}
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Message */}
      {errorMsg && (
        <View className="mx-4 mb-4 rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-3">
          <Text className="text-red-300 text-sm font-semibold">{errorMsg}</Text>
        </View>
      )}
    </>
  );

  return (
    <FlatList
      className="flex-1 bg-[#1c1f22]"
      data={fields}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={
        <Text className="text-center text-[#64748b] dark:text-[#94a3b8] px-4">
          No hay campos disponibles.
        </Text>
      }
      renderItem={({ item }) => (
        <View className="px-4 mb-4">
          <FieldCard
            id={item.id}
            name={item.fieldName}
            location={item.locationName}
            areaHa={item.areaHa}
            description={item.description}
            handleDelete={handleDelete}
          />
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );
}
