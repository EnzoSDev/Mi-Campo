import fieldsModel from "../models/fields.model.js";
import { polygon, area } from "@turf/turf";

export default {
  handleGetFields,
  handleCreateField,
  handleDeleteField,
  handleGetFieldPlots,
  handleCreatePlot,
};

function calculateAreaHa(coordinatesPolygon) {
  // turf.polygon espera un array de arrays, donde cada array interno es un anillo del polígono
  // Calculamos el área en hectáreas
  const poly = polygon([coordinatesPolygon]);
  const areaM2 = area(poly); // area() devuelve m²
  const areaHa = areaM2 / 10000; // 1 hectárea = 10,000 m²
  return parseFloat(areaHa.toFixed(2));
}

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
  // FieldName, description y locationName se reciben del formulario
  // lat, lng y geojson se reciben desde el mapa

  /*

        Ejemplo de body esperado:
        {
            "fieldName": "Campo 1",
            "description": "Descripcion del campo 1",
            "locationName": "Ubicación del campo 1",
            "lat": -34.6037,
            "lng": -58.3816,
            "coordinatesPolygon":
                        [
                            [-59.12, -37.32],
                            [-59.13, -37.33],
                            [-59.11, -37.34],
                            [-100.12, -37.32]
                        ]
        }

    */

  const { fieldName, description, locationName, lat, lng, coordinatesPolygon } =
    req.body;

  if (
    !fieldName ||
    !locationName ||
    !description ||
    !lat ||
    !lng ||
    !coordinatesPolygon
  ) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  if (!Array.isArray(coordinatesPolygon) || coordinatesPolygon.length < 3) {
    return res
      .status(400)
      .json({ message: "El campo debe tener al menos 3 coordenadas" });
  }

  const areaHa = calculateAreaHa(coordinatesPolygon);

  try {
    const field =
      await fieldsModel.getFieldByCoordinatesPolygon(coordinatesPolygon);
    if (field) {
      return res
        .status(400)
        .json({ message: "Coordenadas del campo inválidas" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
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
