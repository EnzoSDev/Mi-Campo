import { EconomyData } from "../types/economyTypes";
import * as SecureStore from "expo-secure-store";
import { getToken } from "./utils";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export const economyAPI = {
  getEconomyDataByCampaign,
};

async function getEconomyDataByCampaign(
  campaignId: number,
): Promise<EconomyData> {
  try {
    const token = await getToken();

    const response = await fetch(`${API_URL}/economy/campaign/${campaignId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos de economía por campaña");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
