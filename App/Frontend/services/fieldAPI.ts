import * as SecureStore from "expo-secure-store";
import { ResponseFieldType, CreateFieldType } from "@/types/fieldTypes";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export const fieldAPI = {
  getAllFields,
  createField,
  deleteField,
};

async function getAllFields(): Promise<ResponseFieldType[]> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const res = await fetch(`${API_URL}/fields`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al obtener los campos");
    }

    const data = (await res.json()).fields;
    const fields: ResponseFieldType[] = data.map((field: any) => ({
      id: field.id,
      fieldName: field.field_name,
      locationName: field.location_name,
      description: field.description,
      areaHa: field.area_ha,
      lat: field.lat,
      lng: field.lng,
      coordinatesPolygon: field.coordinates_polygon,
    }));
    return fields;
  } catch (error) {
    throw error;
  }
}

async function createField(field: CreateFieldType) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(`${API_URL}/fields`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(field),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
  } catch (error) {
    throw error;
  }
}

async function deleteField(id: number) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(`${API_URL}/fields/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al borrar el campo");
    }
  } catch (error) {
    throw error;
  }
}
