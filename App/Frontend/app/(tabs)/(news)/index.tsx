import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import NewsCard from "@/components/NewsCard";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  source?: string;
}

function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Aquí puedes agregar tu función para cargar las noticias desde la API
  const loadNews = async () => {
    setLoading(true);
    try {
      // TODO: Implementar llamada a la API
      // const response = await fetch('TU_API_URL');
      // const data = await response.json();
      // setNews(data);

      // Datos de ejemplo mientras conectas tu API
      setNews([
        {
          id: 1,
          title: "Nueva temporada de siembra",
          description: "Mejores prácticas para la siembra de esta temporada...",
          imageUrl: "https://via.placeholder.com/400x300",
          date: "Hace 2 horas",
          source: "AgroNews",
        },
        {
          id: 2,
          title: "Avances en agricultura sostenible",
          description: "Nuevas técnicas que están revolucionando el sector...",
          imageUrl: "https://via.placeholder.com/400x300",
          date: "Hace 5 horas",
          source: "Campo Digital",
        },
      ]);
    } catch (error) {
      console.error("Error cargando noticias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsPress = (newsItem: NewsItem) => {
    // TODO: Navegar a detalle de noticia o abrir enlace
    console.log("Noticia seleccionada:", newsItem);
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
            <NewsCard {...item} onPress={() => handleNewsPress(item)} />
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
