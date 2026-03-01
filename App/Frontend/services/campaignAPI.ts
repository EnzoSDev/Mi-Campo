import {
  SowingType,
  FertilizationType,
  SprayingType,
  HarvestType,
  ObservationType,
} from "@/types/campaignTypes";
import { RecentActivity } from "@/types/utilTypes";

import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export const campaignAPI = {
  unlinkLotFromCampaign,
  completeCampaign,
  getRecentActivities,
  getSowingsByCampaign,
  createSowing,
  getFertilizationsByCampaign,
  createFertilization,
  getSprayingsByCampaign,
  createSpraying,
  getHarvestsByCampaign,
  createHarvest,
  getObservationsByCampaign,
  createObservation,
  getExpenseCategories,
  registerExpense,
};

async function unlinkLotFromCampaign(
  campaignId: number,
  unlinkReason: string,
  lotId: number,
) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/unlinkLot`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unlinkDate: new Date(),
          unlinkReason,
          lotId,
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Error al desvincular el lote de la campaña");
    }

    return true;
  } catch (error) {
    throw error;
  }
}

async function completeCampaign(campaignId: number, completeReason: string) {
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
        body: JSON.stringify({ completeDate: new Date(), completeReason }),
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

async function getRecentActivities(
  campaignId: number,
): Promise<RecentActivity[]> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/activities`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener las actividades recientes");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function getSowingsByCampaign(campaignId: number): Promise<SowingType[]> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(`${API_URL}/campaigns/${campaignId}/sowings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los registros de siembra");
    }

    const data = await response.json();
    return data.map((sowing: any) => ({
      id: sowing.id,
      title: sowing.title,
      cropType: sowing.crop_type,
      variety: sowing.variety,
      sowingDate: sowing.sowing_date,
      density: sowing.density,
      rowSpacing: sowing.row_spacing,
      method: sowing.method,
      notes: sowing.notes,
    }));
  } catch (error) {
    throw error;
  }
}

async function createSowing(campaignId: number, sowingData: SowingType) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/registerSowing`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sowingData),
      },
    );

    if (!response.ok) {
      throw new Error("Error al crear el registro de siembra");
    }
  } catch (error) {
    throw error;
  }
}

// Fertilization APIs
async function getFertilizationsByCampaign(
  campaignId: number,
): Promise<FertilizationType[]> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/fertilizations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener los registros de fertilización");
    }

    const data = await response.json();
    return data.map((fertilization: any) => ({
      id: fertilization.id,
      campaignId: fertilization.campaign_id,
      productName: fertilization.product_name,
      dose: fertilization.dose,
      dateApplied: fertilization.date_applied,
      method: fertilization.method,
      notes: fertilization.notes,
    }));
  } catch (error) {
    throw error;
  }
}

async function createFertilization(
  campaignId: number,
  fertilizationData: FertilizationType,
) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/registerFertilization`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fertilizationData),
      },
    );

    if (!response.ok) {
      throw new Error("Error al crear el registro de fertilización");
    }
  } catch (error) {
    throw error;
  }
}

// Spraying APIs
async function getSprayingsByCampaign(
  campaignId: number,
): Promise<SprayingType[]> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/sprayings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener los registros de pulverización");
    }

    const data = await response.json();
    return data.map((spraying: any) => ({
      id: spraying.id,
      campaignId: spraying.campaign_id,
      productName: spraying.product_name,
      dose: spraying.dose,
      dateApplied: spraying.date_applied,
      target: spraying.target,
      method: spraying.method,
      notes: spraying.notes,
    }));
  } catch (error) {
    throw error;
  }
}

async function createSpraying(campaignId: number, sprayingData: SprayingType) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/registerSpraying`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sprayingData),
      },
    );

    if (!response.ok) {
      throw new Error("Error al crear el registro de pulverización");
    }
  } catch (error) {
    throw error;
  }
}

// Harvest APIs
async function getHarvestsByCampaign(
  campaignId: number,
): Promise<HarvestType[]> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/harvests`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener los registros de cosecha");
    }

    const data = await response.json();
    return data.map((harvest: any) => ({
      id: harvest.id,
      campaignId: harvest.campaign_id,
      harvestDate: harvest.harvest_date,
      totalYieldKg: harvest.total_yield_kg,
      moisturePercentage: harvest.moisture_percentage,
      notes: harvest.notes,
    }));
  } catch (error) {
    throw error;
  }
}

async function createHarvest(campaignId: number, harvestData: HarvestType) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/registerHarvest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(harvestData),
      },
    );

    if (!response.ok) {
      throw new Error("Error al crear el registro de cosecha");
    }
  } catch (error) {
    throw error;
  }
}

// Observation APIs
async function getObservationsByCampaign(
  campaignId: number,
): Promise<ObservationType[]> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/observations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener las observaciones");
    }

    const data = await response.json();
    return data.map((observation: any) => ({
      id: observation.id,
      campaignId: observation.campaign_id,
      observationDate: observation.observation_date,
      note: observation.note,
    }));
  } catch (error) {
    throw error;
  }
}

async function createObservation(
  campaignId: number,
  observationData: ObservationType,
) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/registerObservation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(observationData),
      },
    );

    if (!response.ok) {
      throw new Error("Error al crear la observación");
    }
  } catch (error) {
    throw error;
  }
}

async function getExpenseCategories(): Promise<
  { id: number; description: string }[]
> {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(`${API_URL}/campaigns/getExpenseCategories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las categorías de gastos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function registerExpense(
  campaignId: number,
  categoryId: number,
  concept: string,
  amount: number,
  date: Date,
  notes: string,
) {
  try {
    const token = await SecureStore.getItemAsync("access-token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await fetch(
      `${API_URL}/campaigns/${campaignId}/registerExpense`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_id: categoryId,
          concept,
          amount,
          date,
          notes,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Error al registrar el gasto");
    }
  } catch (error) {
    throw error;
  }
}
