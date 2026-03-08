import { ResponseLotType, CreateLotType } from "@/types/fieldTypes";
import { CreateCampaignType } from "@/types/lotTypes";
import { CampaignType } from "@/types/campaignTypes";
import { getToken } from "./authManager";

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
    const token = await getToken();
    const response = await fetch(`${API_URL}/fields/${fieldId}/lots/geometry`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "Error al obtener la geometría de los lotes",
      );
    }
    console.log("Datos de geometría de los lotes:", data);
    return data.lotsGeometryData;
  } catch (error) {
    throw error;
  }
}

async function createLot(lot: CreateLotType) {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/fields/${lot.fieldId}/lots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lot),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error al crear el lote");
    }
  } catch (error) {
    throw error;
  }
}

async function getAllLots(fieldId: number): Promise<ResponseLotType[]> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/fields/${fieldId}/lots`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Error al obtener los lotes");
    }
    const lotsData = data.lots;
    const lots: ResponseLotType[] = lotsData.map((lot: any) => ({
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
    const token = await getToken();
    const response = await fetch(`${API_URL}/lots/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error al borrar el lote");
    }
  } catch (error) {
    throw error;
  }
}

async function getCampaignActive(lotId: number): Promise<CampaignType | null> {
  try {
    const token = await getToken();

    const response = await fetch(`${API_URL}/lots/${lotId}/campaigns/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    // Si no hay campaña activa (404), retornar null
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener la campaña activa");
    }

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
    const token = await getToken();

    const response = await fetch(`${API_URL}/lots/${lotId}/campaigns/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(campaign),
    });

    const data = await response.json();
    if (!response.ok) {
      if (data.message === "CAMPAIGN_ACTIVE_EXISTS") {
        throw new Error(
          "Ya existe una campaña activa para este lote. No se puede crear una nueva campaña hasta que la campaña activa actual termine.",
        );
      } else {
        throw new Error(data.message || "Error al crear la campaña");
      }
    }
  } catch (error) {
    throw error;
  }
}

async function joinCampaign(lotId: number, campaignId: number) {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/lots/${lotId}/campaigns/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ campaignId }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (data.message === "CAMPAIGN_ACTIVE_EXISTS") {
        throw new Error(
          "Ya existe una campaña activa para este lote. No se puede crear una nueva campaña hasta que la campaña activa actual termine.",
        );
      } else {
        throw new Error(data.message || "Error al unirse a la campaña");
      }
    }
  } catch (error) {
    throw error;
  }
}

async function getCampaignsCompleted(lotId: number): Promise<CampaignType[]> {
  try {
    const token = await getToken();

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

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "Error al obtener las campañas completadas",
      );
    }

    // Validar que completedCampaigns existe y es un array
    if (!data.completedCampaigns || !Array.isArray(data.completedCampaigns)) {
      console.log("No hay campaña completada o formato incorrecto");
      return [];
    }

    const campaigns = data.completedCampaigns.map((campaign: any) => ({
      id: campaign.id,
      campaignName: campaign.campaign_name,
      startDate: campaign.start_date,
      endDate: campaign.end_date,
      description: campaign.description,
    }));

    return campaigns;
  } catch (error) {
    console.error("Error en getCampaignsCompleted:", error);
    throw error;
  }
}
