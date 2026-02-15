export interface CreateFieldType {
  fieldName: string;
  locationName: string;
  description: string;
  lat: number;
  lng: number;
  coordinatesPolygon: { latitude: number; longitude: number }[];
  areaHa: number;
}

export interface ResponseFieldType {
  id: number;
  fieldName: string;
  description: string;
  locationName: string;
  areaHa: number;
  lat: number;
  lng: number;
  coordinatesPolygon: string;
}
