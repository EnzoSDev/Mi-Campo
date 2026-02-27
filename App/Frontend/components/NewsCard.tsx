import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface NewsCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  source?: string;
  onPress?: () => void;
}

function NewsCard({
  title,
  description,
  imageUrl,
  date,
  source,
  onPress,
}: NewsCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-[#2d3136] rounded-2xl shadow-lg mb-4 overflow-hidden"
      activeOpacity={0.7}
    >
      {imageUrl && (
        <View className="w-full h-48">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}

      <View className="p-5">
        <Text
          className="text-[#0f172a] dark:text-white text-xl font-bold mb-2"
          numberOfLines={2}
        >
          {title}
        </Text>

        <Text
          className="text-[#64748b] dark:text-[#94a3b8] text-sm mb-4"
          numberOfLines={3}
        >
          {description}
        </Text>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <MaterialIcons name="access-time" size={16} color="#94a3b8" />
            <Text className="text-[#94a3b8] text-xs ml-1">{date}</Text>
          </View>

          {source && (
            <Text className="text-[#267366] text-sm font-bold">{source}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default NewsCard;
