import connection from "../database/databaseConfig.js";

export default {
  getFieldsByUserId,
  createField,
  deleteField,
  getPlotsByFieldId,
  createPlot,
};

async function getFieldsByUserId(userId) {
  const query =
    "SELECT id, field_name, description, location_name, area_ha, lat, lng, coordinates_polygon FROM fields WHERE user_id = ? and is_active = 1";
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
    "INSERT INTO fields (user_id, field_name, description, location_name, lat, lng, coordinates_polygon, area_ha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    userId,
    fieldName,
    description,
    locationName,
    lat,
    lng,
    JSON.stringify(coordinatesPolygon),
    areaHa,
  ]);
  return result.affectedRows === 1;
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
