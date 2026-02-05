import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export interface FieldType {
  id: number;
  field_name: string;
  description: string;
  location_name: string;
  area_ha: number;
  lat: number;
  lng: number;
  coordinates_polygon: string;
}

export const fieldAPI = {
  getAllFields,
  deleteField,
};

async function getAllFields(): Promise<FieldType[]> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const fields = await fetch(`${API_URL}/fields`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!fields.ok) {
      throw new Error("Error al obtener los campos");
    }

    const data = await fields.json();
    return data.fields;
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

export const fieldsAPI = {
  getAllFields,
  deleteField,
};
