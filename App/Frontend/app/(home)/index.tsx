import { Text, View, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const router = useRouter();

  return isLoading ? (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#267366" />
    </View>
  ) : sessionActive ? (
    router.replace("/home")
  ) : (
    router.replace("/login")
  );
}
