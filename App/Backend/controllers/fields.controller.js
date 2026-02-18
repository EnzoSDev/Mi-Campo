import fieldsModel from "../models/fields.model.js";
import { polygon, area } from "@turf/turf";

export default {
  handleGetFields,
  handleCreateField,
  handleDeleteField,
  handleGetFieldPlots,
  handleCreatePlot,
  handleGetFieldGeometry,
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

async function handleGetFieldPlots(req, res) {
  const { fieldId } = req.params;

  try {
    const plots = await fieldsModel.getPlotsByFieldId(fieldId);
    res.status(200).json({ plots });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handleCreatePlot(req, res) {
  const { fieldId } = req.params;
  const { plotName, description, coordinatesPolygon } = req.body;

  if (!plotName || !coordinatesPolygon || !description) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  if (!Array.isArray(coordinatesPolygon) || coordinatesPolygon.length < 3) {
    return res
      .status(400)
      .json({ message: "El lote debe tener al menos 3 coordenadas" });
  }

  if (
    coordinatesPolygon[0][0] !==
      coordinatesPolygon[coordinatesPolygon.length - 1][0] ||
    coordinatesPolygon[0][1] !==
      coordinatesPolygon[coordinatesPolygon.length - 1][1]
  ) {
    return res.status(400).json({
      message:
        "El lote debe estar cerrado (la primera y última coordenada deben ser iguales)",
    });
  }

  try {
    const plot =
      await fieldsModel.getPlotByCoordinatesPolygon(coordinatesPolygon);
    if (plot) {
      return res
        .status(400)
        .json({ message: "Coordenadas del lote inválidas" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }

  const areaHa = calculateAreaHa(coordinatesPolygon);

  try {
    const result = await fieldsModel.createPlot({
      fieldId,
      plotName,
      description,
      coordinatesPolygon,
      areaHa,
    });
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
