import fieldsModel from "../models/fields.model.js";
import { polygon, area } from "@turf/turf";

export default {
  handleGetFields,
  handleCreateField,
  handleDeleteField,
  handleGetFieldLots,
  handleCreateLot,
  handleGetFieldGeometry,
  handleGetFieldLotsGeometry,
  handleGetActiveCampaignsByField,
};

async function handleGetFields(req, res) {
  try {
    const userId = req.user.id;
    const fields = await fieldsModel.getFieldsByUserId(userId);
    res.status(200).json({ fields });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handleCreateField(req, res) {
  const userId = req.user.id;
  const {
    fieldName,
    description,
    locationName,
    lat,
    lng,
    coordinatesPolygon,
    areaHa,
  } = req.body;

  console.log("Datos recibidos para crear campo:", {
    fieldName,
    description,
    locationName,
    lat,
    lng,
    coordinatesPolygon,
    areaHa,
  });

  if (
    !fieldName ||
    !locationName ||
    !description ||
    !lat ||
    !lng ||
    !coordinatesPolygon ||
    !areaHa
  ) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  if (!Array.isArray(coordinatesPolygon) || coordinatesPolygon.length < 3) {
    return res
      .status(400)
      .json({ message: "El campo debe tener al menos 3 coordenadas" });
  }

  try {
    const result = await fieldsModel.createField({
      userId,
      fieldName,
      description,
      locationName,
      lat,
      lng,
      coordinatesPolygon,
      areaHa,
    });
    if (result) {
      res.status(201).json({ message: "Campo creado exitosamente" });
    } else res.status(500).json({ message: "No se pudo crear el campo" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handleDeleteField(req, res) {
  const { fieldId } = req.params;
  try {
    const result = await fieldsModel.deleteField(fieldId);
    if (result) {
      res.status(200).json({ message: "Campo borrado exitosamente" });
    } else {
      res.status(404).json({ message: "Campo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handleGetFieldLots(req, res) {
  const { fieldId } = req.params;

  try {
    const lots = await fieldsModel.getLotsByFieldId(fieldId);
    res.status(200).json({ lots });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handleCreateLot(req, res) {
  const { fieldId } = req.params;
  const { lotName, description, coordinatesPolygon, areaHa } = req.body;

  if (!lotName || !coordinatesPolygon || !description || !areaHa) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  console.log("Datos recibidos para crear lote:", {
    lotName,
    description,
    coordinatesPolygon,
    areaHa,
  });

  if (!Array.isArray(coordinatesPolygon) || coordinatesPolygon.length < 3) {
    return res
      .status(400)
      .json({ message: "El lote debe tener al menos 3 coordenadas" });
  }

  if (coordinatesPolygon.length < 3) {
    return res
      .status(400)
      .json({ message: "El lote debe tener al menos 3 coordenadas" });
  }

  try {
    const result = await fieldsModel.createLot({
      fieldId,
      lotName,
      description,
      coordinatesPolygon,
      areaHa,
    });
    console.log("Resultado de creación de lote:", result);
    if (result) {
      res.status(201).json({ message: "Lote creado exitosamente" });
    } else res.status(500).json({ message: "No se pudo crear el lote" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handleGetFieldGeometry(req, res) {
  const { fieldId } = req.params;
  try {
    const geometry = await fieldsModel.getFieldGeometry(fieldId);
    if (geometry) {
      res.status(200).json({
        lat: geometry.lat,
        lng: geometry.lng,
        coordinatesPolygon: geometry.coordinatesPolygon,
      });
    } else {
      res.status(404).json({ message: "Campo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handleGetFieldLotsGeometry(req, res) {
  const { fieldId } = req.params;
  try {
    const lotsGeometryData = await fieldsModel.getFieldLotsGeometry(fieldId);
    console.log("Datos de geometría de los lotes:", lotsGeometryData);
    if (lotsGeometryData) {
      res.status(200).json({ lotsGeometryData });
    } else {
      res.status(404).json({ message: "Campo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handleGetActiveCampaignsByField(req, res) {
  const { fieldId } = req.params;
  try {
    const activeCampaigns =
      await fieldsModel.getActiveCampaignsByField(fieldId);
    res.status(200).json(
      activeCampaigns.map((campaign) => ({
        id: campaign.id,
        campaignName: campaign.campaign_name,
        description: campaign.description,
        startDate: campaign.start_date,
        endDate: campaign.end_date,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
