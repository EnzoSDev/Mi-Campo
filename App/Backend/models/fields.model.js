import connection from "../database/databaseConfig.js";

export default {
  getFieldsByUserId,
  createField,
  deleteField,
  getPlotsByFieldId,
  createPlot,
  getFieldGeometry,
};

async function getFieldsByUserId(userId) {
  const query =
    "SELECT id, field_name, description, location_name, area_ha, lat, lng FROM fields WHERE user_id = ? and is_active = 1";
  const [rows] = await connection.execute(query, [userId]);
  return rows;
}

async function createField({
  userId,
  fieldName,
  description,
  locationName,
  lat,
  lng,
  coordinatesPolygon,
  areaHa,
}) {
  const query =
    "INSERT INTO fields (user_id, field_name, description, location_name, lat, lng, area_ha) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    userId,
    fieldName,
    description,
    locationName,
    lat,
    lng,
    areaHa,
  ]);

  // Si el campo se creo, inserto las coordenadas del poligono
  if (result.affectedRows === 1) {
    try {
      let order = 1;
      for (const coord of coordinatesPolygon) {
        const insertCoordQuery =
          "INSERT INTO field_coordinates (field_id, latitude, longitude, point_order) VALUES (?, ?, ?, ?)";
        await connection.execute(insertCoordQuery, [
          result.insertId,
          coord.latitude,
          coord.longitude,
          order,
        ]);
        order++;
      }
      return true;
    } catch (error) {
      // Si hay un error al insertar las coordenadas, elimino el campo creado para evitar datos inconsistentes
      const deleteQuery = "DELETE FROM fields WHERE id = ?";
      await connection.execute(deleteQuery, [result.insertId]);
      throw error;
    }
  }
  return false;
}

async function deleteField(fieldId) {
  const query = "UPDATE fields SET is_active = 0 WHERE id = ?";
  const [result] = await connection.execute(query, [fieldId]);
  return result.affectedRows === 1;
}

async function getPlotsByFieldId(fieldId) {
  const query =
    "SELECT id, plot_name, coordinates_polygon, area_ha, description FROM plots WHERE field_id = ? and is_active = 1";
  const [rows] = await connection.execute(query, [fieldId]);
  return rows;
}

async function createPlot({
  fieldId,
  plotName,
  description,
  coordinatesPolygon,
  areaHa,
}) {
  const query =
    "INSERT INTO plots (field_id, plot_name, description, coordinates_polygon, area_ha) VALUES (?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    fieldId,
    plotName,
    description,
    JSON.stringify(coordinatesPolygon),
    areaHa,
  ]);
  return result.affectedRows === 1;
}

async function getFieldGeometry(fieldId) {
  const centerCoordQuery =
    "SELECT lat, lng FROM fields WHERE id = ? and is_active = 1";
  const [center] = await connection.execute(centerCoordQuery, [fieldId]);

  if (center.length === 0) {
    throw new Error("Campo no encontrado");
  }

  const coordinatesPolygonQuery =
    "SELECT latitude, longitude FROM field_coordinates WHERE field_id = ? ORDER BY point_order ASC";
  const [coordinatesPolygon] = await connection.execute(
    coordinatesPolygonQuery,
    [fieldId],
  );

  return {
    lat: center[0].lat,
    lng: center[0].lng,
    coordinatesPolygon: coordinatesPolygon.map((coord) => ({
      latitude: coord.latitude,
      longitude: coord.longitude,
    })),
  };
}
