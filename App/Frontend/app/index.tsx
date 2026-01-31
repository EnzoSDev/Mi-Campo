import { Text, View, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  return isLoading ? (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#267366" />
    </View>
  ) : sessionActive ? (
    <Redirect href="/home" />
  ) : (
    <Redirect href="/login" />
  );
}
