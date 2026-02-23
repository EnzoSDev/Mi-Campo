import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";

// Services
import { userAPI } from "../services/userAPI";

export default function Index() {
  // Esta variable existe porque asi se da tiempo a que se cargue el layout, sino el router.replace falla
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionActive, setSessionActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await userAPI.checkSession();
        setSessionActive(res);
      } catch (error) {
        setSessionActive(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (sessionActive) {
        router.replace("/(tabs)/(register)/home");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [isLoading, sessionActive]);

  return (
    <View className="flex-1 justify-center items-center bg-[#1c1f22]">
      <ActivityIndicator size="large" color="#267366" />
    </View>
  );
}
