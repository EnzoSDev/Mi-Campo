import { View, Text, FlatList, ActivityIndicator, Linking } from "react-native";
import { useState, useEffect } from "react";
import NewsCard from "@/components/NewsCard";
import { NewsItem } from "@/types/utilTypes";

import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await SecureStore.getItemAsync("access-token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch(`${API_URL}/news`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNews(data);
    } catch (error) {
      setError("Error al cargar las noticias" + error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsPress = (newsItem: NewsItem) => {
    Linking.openURL(newsItem.url);
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-[#1e2125]">
      <View className="px-6 pt-4 pb-4 border-b border-gray-100 dark:border-[#2d3136]">
        <Text className="text-[#0f172a] dark:text-white text-2xl font-bold mb-1">
          Noticias
        </Text>
        <Text className="text-[#64748b] dark:text-[#94a3b8] text-sm">
          Mantente informado con las últimas novedades del agro
        </Text>
      </View>

      {error && (
        <View className="mx-4 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <Text className="text-red-600 dark:text-red-300">{error}</Text>
        </View>
      )}

      {loading && news.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#267366" />
          <Text className="text-[#64748b] dark:text-[#94a3b8] mt-4">
            Cargando noticias...
          </Text>
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NewsCard newItem={item} onPress={() => handleNewsPress(item)} />
          )}
          contentContainerStyle={{
            padding: 16,
          }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-[#64748b] dark:text-[#94a3b8] text-center">
                No hay noticias disponibles
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default News;
