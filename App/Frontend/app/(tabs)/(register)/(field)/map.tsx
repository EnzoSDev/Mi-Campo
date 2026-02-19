import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Marker, Polygon } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import { fieldAPI } from "@/services/fieldAPI";

interface LatLng {
  latitude: number;
  longitude: number;
}

function Map() {
  const { id } = useLocalSearchParams();
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [coordinatesPolygon, setCoordinatesPolygon] = useState<LatLng[]>([]);
  const [lotsCoordinates, setLotsCoordinates] = useState<
    { id: number; lotName: string; coordinatesPolygon: LatLng[] }[]
  >([]);
  const mapRef = useRef<MapView>(null);
  /*

    Uso mapRef para poder animar el mapa hacia la región del campo una vez que se cargan los datos de latitud, longitud y polígono.
    De lo contrario el mapa se renderiza inicialmente con una región por defecto (en este caso, Buenos Aires) y luego no se mueve hacia la ubicación del campo.

  */
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchFieldGeometryData = async () => {
      try {
        const data = await fieldAPI.getFieldGeometry(Number(id));
        console.log("Field geometry data:", data);
        const latitude = Number(data.lat);
        const longitude = Number(data.lng);
        setLat(latitude);
        setLng(longitude);
        setCoordinatesPolygon(data.coordinatesPolygon);
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

    const fetchLotsGeometryData = async () => {
      try {
        const data = await fieldAPI.getAllLotsGeometryData(Number(id));
        setLotsCoordinates(data);
      } catch (error) {
        console.error("Error fetching lots geometry data:", error);
      }
    };

    fetchLotsGeometryData();
  }, [id]);

  // TODO: fetchPaddocksGeometryData

  function calculateCentroid(coordinates: LatLng[]) {
    const totalPoints = coordinates.length;
    const sum = coordinates.reduce(
      (acc, point) => {
        return {
          latitude: acc.latitude + point.latitude,
          longitude: acc.longitude + point.longitude,
        };
      },
      { latitude: 0, longitude: 0 },
    );
    return {
      latitude: sum.latitude / totalPoints,
      longitude: sum.longitude / totalPoints,
    };
  }

  return (
    <>
      <View className="flex-row items-center gap-2 bg-surface-dark px-4 pt-4 pb-2 border-b border-border-dark/50">
        <TouchableOpacity
          className="p-2 rounded-full bg-background-dark mr-2"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        mapType="hybrid"
        initialRegion={{
          latitude: lat || -34.6037,
          longitude: lng || -58.3816,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {isLoaded && coordinatesPolygon.length > 0 && (
          // El componente Polygon espera un array de tipo LatLng
          <Polygon
            coordinates={coordinatesPolygon}
            strokeColor="#F97316"
            fillColor="rgba(249, 115, 22, 0.25)"
            strokeWidth={3}
          />
        )}

        {isLoaded && lat !== 0 && lng !== 0 && (
          <Marker
            coordinate={{ latitude: lat, longitude: lng }}
            title="Centro del campo"
          />
        )}
        {lotsCoordinates.map((lot) => (
          <Polygon
            key={lot.id}
            coordinates={lot.coordinatesPolygon}
            strokeColor="#3B82F6"
            fillColor="rgba(59, 130, 246, 0.35)"
            strokeWidth={3}
          />
        ))}
        {lotsCoordinates.map((lot) => (
          <Marker
            key={lot.id}
            coordinate={calculateCentroid(lot.coordinatesPolygon)} // Coloco el marcador en la primera coordenada del polígono del lote
            title={lot.lotName}
          />
        ))}
      </MapView>

      <View className="absolute bottom-6 left-0 right-0 items-center">
        <View className="bg-gray-900/90 rounded-full px-4 py-2.5 flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#F97316" }}
            />
            <Text className="text-white text-xs font-medium">Campo</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#3B82F6" }}
            />
            <Text className="text-white text-xs font-medium">Lotes</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#10B981" }}
            />
            <Text className="text-white text-xs font-medium">Potreros</Text>
          </View>
        </View>
      </View>
    </>
  );
}
export default Map;
