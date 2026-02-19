import * as SecureStore from "expo-secure-store";
import {
  ResponseFieldType,
  CreateFieldType,
  CreateLotType,
  ResponseLotType,
} from "@/types/fieldTypes";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export const fieldAPI = {
  getAllFields,
  createField,
  deleteField,
  getFieldGeometry,
  getAllLotsGeometryData,
  getAllLots,
  createLot,
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

async function getFieldGeometry(id: number) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(`${API_URL}/fields/${id}/geometry`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener la geometría del campo");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function getAllLotsGeometryData(fieldId: number) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(`${API_URL}/fields/${fieldId}/lots/geometry`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la geometría de los lotes");
    }

    const data = await response.json();
    console.log("Datos de geometría de los lotes:", data);
    return data.lotsGeometryData;
  } catch (error) {
    throw error;
  }
}

async function createLot(lot: CreateLotType) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(`${API_URL}/fields/${lot.fieldId}/lots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lot),
    });

    if (!response.ok) {
      throw new Error("Error al crear el lote");
    }
  } catch (error) {
    throw error;
  }
}

async function getAllLots(fieldId: number): Promise<ResponseLotType[]> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const res = await fetch(`${API_URL}/fields/${fieldId}/lots`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al obtener los lotes");
    }
    const data = (await res.json()).lots;
    const lots: ResponseLotType[] = data.map((lot: any) => ({
      id: lot.id,
      lotName: lot.lot_name,
      description: lot.description,
      areaHa: lot.area_ha,
    }));
    return lots;
  } catch (error) {
    throw error;
  }
}
