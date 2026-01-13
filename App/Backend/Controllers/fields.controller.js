import fieldsModel from '../Models/fields.model.js'
import { polygon, area } from '@turf/turf'

export default {
  handleGetFields,
  handleCreateField
}

function calculateAreaHa (coordinatesPolygon) {
  // turf.polygon espera un array de arrays, donde cada array interno es un anillo del polígono
  // Calculamos el área en hectáreas
  const poly = polygon([coordinatesPolygon])
  const areaM2 = area(poly) // area() devuelve m²
  const areaHa = areaM2 / 10000 // 1 hectárea = 10,000 m²
  return parseFloat(areaHa.toFixed(2))
}

async function handleGetFields (req, res) {
  try {
    const userId = req.user.id
    const fields = await fieldsModel.getFieldsByUserId(userId)
    res.status(200).json({ fields })
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

async function handleCreateField (req, res) {
  const userId = req.user.id
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

  const { fieldName, description, locationName, lat, lng, coordinatesPolygon } = req.body

  if (!fieldName || !locationName || !description || !lat || !lng || !coordinatesPolygon) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' })
  }

  const areaHa = calculateAreaHa(coordinatesPolygon)

  try {
    const result = await fieldsModel.createField({ userId, fieldName, description, locationName, lat, lng, coordinatesPolygon, areaHa })
    if (result) {
      res.status(201).json({ message: 'Campo creado exitosamente' })
    } else res.status(500).json({ message: 'No se pudo crear el campo' })
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
