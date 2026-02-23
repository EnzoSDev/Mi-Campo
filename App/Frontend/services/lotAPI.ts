import * as SecureStore from "expo-secure-store";
import { ResponseLotType, CreateLotType } from "@/types/fieldTypes";
import { CreateCampaignType } from "@/types/lotTypes";
import { CampaignType } from "@/types/campaignTypes";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export const lotAPI = {
  getAllLotsGeometryData,
  getAllLots,
  createLot,
  deleteLot,
  getCampaignActive,
  createCampaign,
  joinCampaign,
  getCampaignsCompleted,
};

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

async function deleteLot(id: number) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(`${API_URL}/lots/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al borrar el lote");
    }
  } catch (error) {
    throw error;
  }
}

async function getCampaignActive(lotId: number): Promise<CampaignType> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(`${API_URL}/lots/${lotId}/campaigns/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la campaña activa");
    }

    const data = await response.json();
    return {
      id: data.activeCampaign.id,
      campaignName: data.activeCampaign.campaign_name,
      startDate: data.activeCampaign.start_date,
      endDate: data.activeCampaign.end_date,
      description: data.activeCampaign.description,
    };
  } catch (error) {
    throw error;
  }
}

async function createCampaign(lotId: number, campaign: CreateCampaignType) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(`${API_URL}/lots/${lotId}/campaigns/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(campaign),
    });

    if (!response.ok) {
      const mensaje = await response.json();
      if (mensaje.message === "CAMPAIGN_ACTIVE_EXISTS") {
        throw new Error(
          "Ya existe una campaña activa para este lote. No se puede crear una nueva campaña hasta que la campaña activa actual termine.",
        );
      } else {
        throw new Error("Error al crear la campaña");
      }
    }
  } catch (error) {
    throw error;
  }
}

async function joinCampaign(lotId: number, campaignId: number) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(`${API_URL}/lots/${lotId}/campaigns/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ campaignId }),
    });

    if (!response.ok) {
      const mensaje = await response.json();
      if (mensaje.message === "CAMPAIGN_ACTIVE_EXISTS") {
        throw new Error(
          "Ya existe una campaña activa para este lote. No se puede crear una nueva campaña hasta que la campaña activa actual termine.",
        );
      } else {
        throw new Error("Error al unirse a la campaña");
      }
    }
  } catch (error) {
    throw error;
  }
}

async function getCampaignsCompleted(lotId: number): Promise<CampaignType[]> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await fetch(
      `${API_URL}/lots/${lotId}/campaigns/completed`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener las campañas completadas");
    }

    const data = await response.json();

    // Validar que completedCampaigns existe y es un array
    if (!data.completedCampaigns || !Array.isArray(data.completedCampaigns)) {
      return [];
    }

    return data.completedCampaigns.map((campaign: any) => ({
      id: campaign.id,
      campaignName: campaign.campaign_name,
      startDate: campaign.start_date,
      endDate: campaign.end_date,
      description: campaign.description,
    }));
  } catch (error) {
    throw error;
  }
}
