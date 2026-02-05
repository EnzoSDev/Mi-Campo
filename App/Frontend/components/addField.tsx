import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  useColorScheme,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface AddNewFarmFormProps {
  onBack?: () => void;
  onCreateFarm?: (farmData: FarmData) => void;
}

interface FarmData {
  farmName: string;
  location: string;
  description: string;
}

export const AddNewFarmForm: React.FC<AddNewFarmFormProps> = ({
  onBack,
  onCreateFarm,
}) => {
  const colorScheme = useColorScheme();

  const [formData, setFormData] = useState<FarmData>({
    farmName: "",
    location: "",
    description: "",
  });

  const handleInputChange = (field: keyof FarmData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateFarm = () => {
    if (onCreateFarm) {
      onCreateFarm(formData);
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="sticky top-0 z-50 flex-row items-center bg-background-light/80 dark:bg-background-dark/80 px-4 py-4 border-b border-gray-200 dark:border-border-dark/50">
        <TouchableOpacity
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors mr-2"
          onPress={onBack}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={colorScheme === "dark" ? "#E3E4E6" : "#111827"}
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold tracking-tight text-gray-900 dark:text-text-bright">
          Add New Farm
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Information Section */}
        <View className="mb-8 space-y-4">
          <View className="gap-1">
            <Text className="text-sm font-semibold uppercase tracking-widest text-primary">
              Information
            </Text>
            <Text className="text-xs text-text-muted">
              Enter the core details for your agricultural property.
            </Text>
          </View>

          <View className="space-y-4 bg-white dark:bg-surface-dark p-2 rounded-xl">
            {/* Farm Name Input */}
            <View className="flex-col p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Farm Name
              </Text>
              <TextInput
                className="w-full bg-transparent border-0 border-b border-gray-200 dark:border-border-dark py-2 text-base font-normal dark:text-text-bright placeholder:text-text-muted/50"
                placeholder="e.g., Estancia La Paz"
                placeholderTextColor="#96999E"
                value={formData.farmName}
                onChangeText={(value) => handleInputChange("farmName", value)}
              />
            </View>

            {/* Location Input */}
            <View className="flex-col p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Location/Address
              </Text>
              <View className="flex-row items-center gap-2 border-b border-gray-200 dark:border-border-dark">
                <TextInput
                  className="flex-1 bg-transparent border-0 py-2 text-base font-normal dark:text-text-bright placeholder:text-text-muted/50"
                  placeholder="e.g., Pergamino, Buenos Aires"
                  placeholderTextColor="#96999E"
                  value={formData.location}
                  onChangeText={(value) => handleInputChange("location", value)}
                />
                <MaterialIcons name="location-on" size={18} color="#96999E" />
              </View>
            </View>

            {/* Description Input */}
            <View className="flex-col p-3">
              <Text className="text-xs font-medium text-text-muted mb-1">
                Description / Notes
              </Text>
              <TextInput
                className="w-full bg-transparent border-0 border-b border-gray-200 dark:border-border-dark py-2 text-base font-normal dark:text-text-bright placeholder:text-text-muted/50"
                placeholder="Add any details or notes about the farm property..."
                placeholderTextColor="#96999E"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
              />
            </View>
          </View>
        </View>

        {/* Boundary Definition Section */}
        <View className="mb-8 space-y-4">
          <View className="gap-1">
            <Text className="text-sm font-semibold uppercase tracking-widest text-primary">
              Boundary Definition
            </Text>
            <Text className="text-xs text-text-muted">
              Define the spatial limits of your campo.
            </Text>
          </View>

          <View className="gap-4">
            {/* Draw Boundary Button */}
            <TouchableOpacity className="flex-row items-center gap-4 p-4 bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-xl hover:border-primary/50">
              <View className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MaterialIcons name="polyline" size={24} color="#267366" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold dark:text-text-bright">
                  Draw Boundary on Map
                </Text>
                <Text className="text-xs text-text-muted">
                  Manually trace your field borders
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#96999E" />
            </TouchableOpacity>

            {/* Upload KML/Shapefile Button */}
            <TouchableOpacity className="flex-row items-center gap-4 p-4 bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-xl hover:border-primary/50">
              <View className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MaterialIcons name="cloud-upload" size={24} color="#267366" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold dark:text-text-bright">
                  Upload KML/Shapefile
                </Text>
                <Text className="text-xs text-text-muted">
                  Import existing spatial data (SHP, KML)
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#96999E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Preview */}
        <View className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-100 dark:border-border-dark mb-6">
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzHHfzWrUhTnjHuCJOjvScQS-a3B8sstW_ZrADiRDiOIq1duuOWhGP61LT3qkextAMngsjs5k6HXfFa2laaaN3B4Jw2ypCEepul9ezRobDy8nKkaPNISE8UskRSqFKWjmBhhyQ-MGJtgWIdlRxfOYiybJb8D6APqkxuzQN2ukfz0_e7cVwRKxHfWsDagDEU8B7hmCXXRPBGFL8tZ2hQ2y5I2ox4CJ39sb38DwUg9seRwglk1P6ztFOnSqK8V57UHuBRhY0hOYqE_IH",
            }}
            className="w-full h-full opacity-50"
          />
          <View className="absolute inset-0 flex items-center justify-center bg-primary/10">
            <View className="bg-black/60 px-3 py-1 rounded-full">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-white">
                Boundary Pending
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-border-dark/50">
        <TouchableOpacity
          className="w-full bg-primary hover:bg-primary/90 rounded-xl py-4 flex-row items-center justify-center gap-2"
          onPress={handleCreateFarm}
        >
          <Text className="text-base font-bold text-white">Create Farm</Text>
          <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View className="w-32 h-1 bg-gray-300 dark:bg-border-dark rounded-full self-center mt-6" />
      </View>
    </View>
  );
};

export default AddNewFarmForm;
