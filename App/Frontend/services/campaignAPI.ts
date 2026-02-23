import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export const campaignAPI = {
  completeCampaign,
};

async function completeCampaign(campaignId: number) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/complete`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al finalizar la campaña");
    }

    return true;
  } catch (error) {
    throw error;
  }
}
