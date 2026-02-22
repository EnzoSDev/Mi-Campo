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
}

export interface CreateLotType {
  fieldId: number;
  lotName: string;
  description: string;
  coordinatesPolygon: { latitude: number; longitude: number }[];
  areaHa: number;
}

export interface ResponseLotType {
  id: number;
  lotName: string;
  description: string;
  areaHa: number;
}

export interface FieldContextType {
  fieldId: number;
}
