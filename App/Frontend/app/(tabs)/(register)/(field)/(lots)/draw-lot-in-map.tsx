import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Marker, Polygon } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { fieldAPI } from "@/services/fieldAPI";
import type { CreateLotType } from "@/types/fieldTypes";

interface LatLng {
  latitude: number;
  longitude: number;
}

function DrawLotInMap() {
  const { fieldId, lotName, description } = useLocalSearchParams() as {
    fieldId: string;
    lotName: string;
    description: string;
  };

  const [latField, setLatField] = useState<number>(0);
  const [lngField, setLngField] = useState<number>(0);
  const [coordinatesPolygonField, setCoordinatesPolygonField] = useState<
    LatLng[]
  >([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [coordinatesPolygon, setCoordinatesPolygon] = useState<LatLng[]>([]);
  const [error, setError] = useState("");
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const fetchFieldGeometryData = async () => {
      try {
        const data = await fieldAPI.getFieldGeometry(Number(fieldId));
        console.log("Field geometry data:", data);
        const latitude = Number(data.lat);
        const longitude = Number(data.lng);
        setLatField(latitude);
        setLngField(longitude);
        setCoordinatesPolygonField(data.coordinatesPolygon);
        setIsLoaded(true);

        // Animar hacia la región correcta una vez cargados los datos
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000,
          );
        }
      } catch (error) {
        console.error("Error fetching field geometry data:", error);
      }
    };
    fetchFieldGeometryData();
  }, [fieldId]);

  // ========== FUNCIONES DE GEOMETRÍA ==========

  // Algoritmo Ray Casting para verificar si un punto está dentro de un polígono
  const isPointInsidePolygon = (point: LatLng, polygon: LatLng[]): boolean => {
    const { latitude: x, longitude: y } = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].latitude;
      const yi = polygon[i].longitude;
      const xj = polygon[j].latitude;
      const yj = polygon[j].longitude;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  };

  // Verifica si el lote está completamente dentro del campo
  const isLotInsideField = (
    lotPolygon: LatLng[],
    fieldPolygon: LatLng[],
  ): boolean => {
    return lotPolygon.every((point) =>
      isPointInsidePolygon(point, fieldPolygon),
    );
  };

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

  const calculatePolygonAreaHa = (points: LatLng[]): number => {
    let area = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area +=
        points[i].longitude * points[j].latitude -
        points[j].longitude * points[i].latitude;
    }

    return Math.abs(area / 2) * 12365.1613; // Conversión a hectáreas
  };

  const validatePolygon = (points: LatLng[]): string | null => {
    if (points.length < 3) {
      return "Se requieren al menos 3 puntos para formar un polígono.";
    }

    if (hasPolygonSelfIntersection(points)) {
      return "El polígono se cruza consigo mismo. Evita que las líneas se intersecten.";
    }

    // Validar que el lote esté dentro del campo
    if (
      coordinatesPolygonField.length > 0 &&
      !isLotInsideField(points, coordinatesPolygonField)
    ) {
      return "El lote debe estar completamente dentro del campo. Revisa los puntos que están fuera.";
    }

    return null;
  };

  // ========== HANDLERS ==========

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

    const areaHa = calculatePolygonAreaHa(coordinatesPolygon);
    setError("");

    try {
      const lot: CreateLotType = {
        fieldId: Number(fieldId),
        lotName,
        description,
        coordinatesPolygon,
        areaHa,
      };
      console.log("Creando lote con datos:", lot);
      await fieldAPI.createLot(lot);
      router.back();
    } catch (error) {
      setError("Error al guardar el lote.");
    }
  };

  return (
    <View style={styles.container}>
      <View className="flex-row items-center gap-2 bg-surface-dark px-4 py-3 border-b border-border-dark/50">
        <TouchableOpacity
          className="p-2 rounded-full bg-background-dark mr-2"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType="hybrid"
        onPress={handleMapPress}
        initialRegion={{
          latitude: latField || -34.6037,
          longitude: lngField || -58.3816,
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
            pinColor="#22c55e"
          />
        ))}

        {/* Polígono del lote */}
        {coordinatesPolygon.length >= 3 && (
          <Polygon
            coordinates={coordinatesPolygon}
            fillColor="rgba(34, 197, 94, 0.5)"
            strokeColor="#22c55e"
            strokeWidth={3}
          />
        )}

        {/* Polígono del campo */}
        {isLoaded && coordinatesPolygonField.length > 0 && (
          // El componente Polygon espera un array de tipo LatLng
          <Polygon
            coordinates={coordinatesPolygonField}
            strokeColor="#60a5fa"
            fillColor="rgba(96, 165, 250, 0.15)"
            strokeWidth={2}
          />
        )}

        {isLoaded && latField !== 0 && lngField !== 0 && (
          <Marker
            coordinate={{ latitude: latField, longitude: lngField }}
            title="Centro del campo"
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

export default DrawLotInMap;
