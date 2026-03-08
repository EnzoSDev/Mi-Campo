import { ResponseFieldType, CreateFieldType } from "@/types/fieldTypes";
import { CampaignType } from "@/types/campaignTypes";
import { getToken } from "./authManager";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

export const fieldAPI = {
  getAllFields,
  createField,
  deleteField,
  getFieldGeometry,
  getAllActiveCampaigns,
  getCampaignsByField,
};

async function getAllFields(): Promise<ResponseFieldType[]> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/fields`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      // TODO: Es data.message??????????? Que devuelve el authmiddleware??????
      throw new Error(data.message || "Error al obtener los campos");
    }

    const fields: ResponseFieldType[] = data.fields.map((field: any) => ({
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
    const token = await getToken();
    const response = await fetch(`${API_URL}/fields`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(field),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error al crear el campo");
    }
  } catch (error) {
    throw error;
  }
}

async function deleteField(id: number) {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/fields/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      // TODO: Es data.message o data.error???????????
      throw new Error(data.message || "Error al eliminar el campo");
    }
  } catch (error) {
    throw error;
  }
}

async function getFieldGeometry(id: number) {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/fields/${id}/geometry`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "Error al obtener la geometría del campo",
      );
    }
    return data;
  } catch (error) {
    throw error;
  }
}

async function getAllActiveCampaigns(fieldId: number): Promise<CampaignType[]> {
  try {
    const token = await getToken();

    const response = await fetch(
      `${API_URL}/fields/${fieldId}/campaigns/all-active`,
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
      throw new Error(data.message || "Error al obtener las campañas activas");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

async function getCampaignsByField(fieldId: number): Promise<CampaignType[]> {
  try {
    const token = await getToken();

    const response = await fetch(`${API_URL}/fields/${fieldId}/campaigns`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "Error al obtener las campañas del campo",
      );
    }
    return data;
  } catch (error) {
    throw error;
  }
}
