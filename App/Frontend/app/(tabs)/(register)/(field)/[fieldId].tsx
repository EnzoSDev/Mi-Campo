import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import MapButton from "../../../../components/MapButton";
import Lots from "../../../../components/Lots";
import Paddocks from "../../../../components/Paddocks";
import { useField } from "@/context/FieldContext";

function Field() {
  const [activeTab, setActiveTab] = useState("lots");
  const { fieldId: id, name, location } = useLocalSearchParams();
  // Para poder usar el fieldId en los componentes hijos, lo guardamos en el contexto
  const setFieldId = useField().setFieldId;
  console.log(id, name, location);

  useEffect(() => {
    if (id) {
      setFieldId(Number(id));
    }
  }, [id, setFieldId]);

  return (
    <View className="flex-1 bg-[#1c1f22]">
      <View className="bg-[#1c1f22] border-white/10 pt-4">
        <View className="flex-row items-center justify-between px-4 pb-4">
          <TouchableOpacity
            className="p-2 rounded-full bg-background-dark mr-2"
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text className="text-[17px] font-bold text-white text-center">
              {name}
            </Text>
            <Text className="text-[10px] text-white/50 text-center mt-0.5 font-semibold tracking-[1px]">
              {location}
            </Text>
          </View>
        </View>

        <View className="px-4 pb-4">
          <View className="bg-white/10 rounded-[9px] p-0.5 flex-row gap-1">
            <Pressable
              onPress={() => setActiveTab("lots")}
              className={`flex-1 py-2.5 px-3 rounded-[7px] items-center justify-center ${
                activeTab === "lots" ? "bg-[#2d3136]" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-[13px] font-semibold ${
                  activeTab === "lots" ? "text-white" : "text-white/60"
                }`}
              >
                Lotes
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("paddocks")}
              className={`flex-1 py-2.5 px-3 rounded-[7px] items-center justify-center ${
                activeTab === "paddocks" ? "bg-[#2d3136]" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-[13px] font-semibold ${
                  activeTab === "paddocks" ? "text-white" : "text-white/60"
                }`}
              >
                Potreros
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <MapButton
        onPress={() =>
          router.push({
            pathname: "/(tabs)/(register)/(field)/map",
            params: { id },
          })
        }
      />

      {activeTab === "lots" && <Lots />}
      {activeTab === "paddocks" && <Paddocks />}
    </View>
  );
}

export default Field;
