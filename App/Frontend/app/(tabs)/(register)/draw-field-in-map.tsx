import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Marker, Polygon } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { fieldAPI } from "../../../services/fieldAPI";
import { CreateFieldType } from "@/types/fieldType";

interface LatLng {
  latitude: number;
  longitude: number;
}

function DrawFieldInMap() {
  const { latUser, lngUser, fieldName, locationName, description } =
    useLocalSearchParams() as {
      latUser: string;
      lngUser: string;
      fieldName: string;
      locationName: string;
      description: string;
    };

  const [searchText, setSearchText] = useState("");
  const [coordinatesPolygon, setCoordinatesPolygon] = useState<LatLng[]>([]);
  const [error, setError] = useState("");
  const mapRef = useRef<MapView>(null);

  // ========== FUNCIONES DE GEOMETRÍA ==========
  const doSegmentsIntersect = (
    p1: LatLng,
    p2: LatLng,
    p3: LatLng,
    p4: LatLng,
  ): boolean => {
    const ccw = (a: LatLng, b: LatLng, c: LatLng) => {
      return (
        (c.longitude - a.longitude) * (b.latitude - a.latitude) >
        (b.longitude - a.longitude) * (c.latitude - a.latitude)
      );
    };

    return (
      ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4)
    );
  };

  const hasPolygonSelfIntersection = (points: LatLng[]): boolean => {
    if (points.length < 4) return false;

    for (let i = 0; i < points.length; i++) {
      const nextI = (i + 1) % points.length;
      for (let j = i + 2; j < points.length; j++) {
        const nextJ = (j + 1) % points.length;
        if (i === nextJ) continue;

        if (
          doSegmentsIntersect(
            points[i],
            points[nextI],
            points[j],
            points[nextJ],
          )
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const calculatePolygonCenter = (points: LatLng[]): LatLng => {
    const avgLat =
      points.reduce((sum, p) => sum + p.latitude, 0) / points.length;
    const avgLng =
      points.reduce((sum, p) => sum + p.longitude, 0) / points.length;
    return { latitude: avgLat, longitude: avgLng };
  };

  const validatePolygon = (points: LatLng[]): string | null => {
    if (points.length < 3) {
      return "Se requieren al menos 3 puntos para formar un polígono.";
    }

    if (hasPolygonSelfIntersection(points)) {
      return "El polígono se cruza consigo mismo. Evita que las líneas se intersecten.";
    }

    return null;
  };

  // ========== HANDLERS ==========
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
    setCoordinatesPolygon([...coordinatesPolygon, { latitude, longitude }]);
    setError("");
  };

  const handleUndo = () => {
    setCoordinatesPolygon(coordinatesPolygon.slice(0, -1));
    setError("");
  };

  const handleClear = () => {
    setCoordinatesPolygon([]);
    setError("");
  };

  const handleFinish = async () => {
    const validationError = validatePolygon(coordinatesPolygon);
    if (validationError) {
      setError(validationError);
      return;
    }

    const center = calculatePolygonCenter(coordinatesPolygon);
    setError("");

    try {
      const field: CreateFieldType = {
        fieldName,
        locationName,
        description,
        lat: center.latitude,
        lng: center.longitude,
        coordinatesPolygon: JSON.stringify(coordinatesPolygon),
      };
      console.log("Creando campo con datos:", field);
      await fieldAPI.createField(field);
      router.replace("/(tabs)/(register)/home");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al guardar el campo.",
      );
    }
  };

  const center =
    coordinatesPolygon.length >= 3
      ? calculatePolygonCenter(coordinatesPolygon)
      : null;

  return (
    <View style={styles.container}>
      {/* Header con búsqueda */}
      <View className="flex-row items-center gap-2 bg-surface-dark px-4 py-3 border-b border-border-dark/50">
        <TouchableOpacity
          className="p-2 rounded-full bg-background-dark mr-2"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
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

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType="hybrid"
        onPress={handleMapPress}
        initialRegion={{
          latitude: parseFloat(latUser) || -34.6037,
          longitude: parseFloat(lngUser) || -58.3816,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marcadores de los puntos */}
        {coordinatesPolygon.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            title={`Punto ${index + 1}`}
            pinColor="#267366"
          />
        ))}

        {/* Polígono */}
        {coordinatesPolygon.length >= 3 && (
          <Polygon
            coordinates={coordinatesPolygon}
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

      {/* Panel de Control */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-dark p-4 border-t border-border-dark/50">
        <Text className="text-text-bright font-bold mb-2">
          Puntos: {coordinatesPolygon.length}
        </Text>

        {/* Mensaje de Error */}
        {error !== "" && (
          <View className="mb-3 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex-row items-start">
            <MaterialIcons name="error-outline" size={18} color="#ef4444" />
            <View className="flex-1 ml-2">
              <Text className="text-sm font-semibold text-red-400 mb-1">
                Error de Validación
              </Text>
              <Text className="text-xs text-red-300">{error}</Text>
            </View>
          </View>
        )}

        {/* Información del Centro */}
        {center && error === "" && (
          <View className="mb-3 bg-background-dark p-3 rounded-lg border border-primary/50">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-primary font-bold text-sm">
                Centro del Campo
              </Text>
              <MaterialIcons name="check-circle" size={18} color="#267366" />
            </View>
            <Text className="text-text-bright text-xs">
              Lat: {center.latitude.toFixed(6)}
            </Text>
            <Text className="text-text-bright text-xs">
              Lng: {center.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        {/* Botones de Control */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 bg-primary py-2 rounded-lg flex-row items-center justify-center gap-2"
            disabled={coordinatesPolygon.length === 0}
            onPress={handleUndo}
          >
            <MaterialIcons name="undo" size={18} color="white" />
            <Text className="text-white font-bold">Deshacer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-red-600 py-2 rounded-lg flex-row items-center justify-center gap-2"
            disabled={coordinatesPolygon.length === 0}
            onPress={handleClear}
          >
            <MaterialIcons name="delete" size={18} color="white" />
            <Text className="text-white font-bold">Limpiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-green-600 py-2 rounded-lg flex-row items-center justify-center gap-2"
            disabled={coordinatesPolygon.length < 3}
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
    backgroundColor: "#1c1f22",
  },
  map: {
    flex: 1,
  },
});

export default DrawFieldInMap;
