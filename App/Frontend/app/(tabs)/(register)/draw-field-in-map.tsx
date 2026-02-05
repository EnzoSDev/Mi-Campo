import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { useState, useRef } from "react";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

interface LatLng {
  latitude: number;
  longitude: number;
}

interface Params {
  latitude: string;
  longitude: string;
}

function DrawFieldInMap() {
  const { latitude, longitude } = useLocalSearchParams() as unknown as Params;
  const [searchText, setSearchText] = useState("");
  const [points, setPoints] = useState<LatLng[]>([]);
  const mapRef = useRef<MapView>(null);

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    try {
      const results = await Location.geocodeAsync(searchText);
      if (results.length > 0) {
        const { latitude: lat, longitude: lng } = results[0];

        mapRef.current?.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setSearchText("");
      }
    } catch (error) {
      console.log("Error buscando ubicación:", error);
    }
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPoints([...points, { latitude, longitude }]);
  };

  const handleUndo = () => {
    setPoints(points.slice(0, -1));
  };

  const handleClear = () => {
    setPoints([]);
  };

  const handleFinish = () => {
    if (points.length >= 3) {
      const center = calculatePolygonCenter(points);
      console.log("Polígono finalizado:", { points, center });
      // Aquí puedes guardar el polígono o hacer algo con él
    }
  };

  const calculatePolygonCenter = (points: LatLng[]): LatLng => {
    const avgLat =
      points.reduce((sum, p) => sum + p.latitude, 0) / points.length;
    const avgLng =
      points.reduce((sum, p) => sum + p.longitude, 0) / points.length;
    return { latitude: avgLat, longitude: avgLng };
  };

  const center = points.length >= 3 ? calculatePolygonCenter(points) : null;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View className="flex-row items-center gap-2 bg-surface-dark px-4 py-3 border-b border-border-dark/50">
        <TouchableOpacity className="p-2 rounded-full bg-background-dark mr-2">
          <MaterialIcons
            name="arrow-back"
            size={20}
            color="white"
            onPress={() => router.back()}
          />
        </TouchableOpacity>
        <TextInput
          className="flex-1 px-3 py-2 bg-background-dark text-text-bright border border-border-dark rounded-lg text-sm"
          placeholder="Ej: Mar del Plata, Argentina"
          placeholderTextColor="#96999E"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          className="bg-primary p-2 rounded-lg flex items-center justify-center"
          onPress={handleSearch}
        >
          <MaterialIcons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        mapType="hybrid"
        onPress={handleMapPress}
        initialRegion={{
          latitude: latitude ? parseFloat(latitude) : 37.78825,
          longitude: longitude ? parseFloat(longitude) : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marcadores de los puntos */}
        {points.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            title={`Punto ${index + 1}`}
            pinColor="#267366"
          />
        ))}

        {/* Polígono */}
        {points.length >= 3 && (
          <Polygon
            coordinates={points}
            fillColor="rgba(38, 115, 102, 0.3)"
            strokeColor="#267366"
            strokeWidth={2}
          />
        )}

        {/* Marcador central */}
        {center && (
          <Marker
            coordinate={center}
            title="Centro del Campo"
            pinColor="#FF6B6B"
          />
        )}
      </MapView>

      {/* Control Panel */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-dark p-4 border-t border-border-dark/50">
        <Text className="text-text-bright font-bold mb-2">
          Puntos: {points.length}
        </Text>

        {center && (
          <View className="mb-3 bg-background-dark p-3 rounded-lg border border-border-dark/50">
            <Text className="text-primary font-bold text-sm mb-1">
              Centro del Campo
            </Text>
            <Text className="text-text-bright text-xs">
              Lat: {center.latitude.toFixed(6)}
            </Text>
            <Text className="text-text-bright text-xs">
              Lng: {center.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 bg-primary py-2 rounded-lg flex-row items-center justify-center gap-2"
            disabled={points.length === 0}
            onPress={handleUndo}
          >
            <MaterialIcons name="undo" size={18} color="white" />
            <Text className="text-white font-bold">Deshacer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-red-600 py-2 rounded-lg flex-row items-center justify-center gap-2"
            disabled={points.length === 0}
            onPress={handleClear}
          >
            <MaterialIcons name="delete" size={18} color="white" />
            <Text className="text-white font-bold">Limpiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-green-600 py-2 rounded-lg flex-row items-center justify-center gap-2"
            disabled={points.length < 3}
            onPress={handleFinish}
          >
            <MaterialIcons name="check" size={18} color="white" />
            <Text className="text-white font-bold">Finalizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 130,
  },
});

export default DrawFieldInMap;
