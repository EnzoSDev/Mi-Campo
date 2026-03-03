import { EconomyData } from "../types/economyTypes";
import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export const economyAPI = {
  getAllEconomyData,
};

async function getAllEconomyData(): Promise<EconomyData> {
  try {
    const token = await SecureStore.getItemAsync("access-token");

    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(`${API_URL}/economy`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos de economía");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getAllEconomyData:", error);
    throw error;
  }
}
