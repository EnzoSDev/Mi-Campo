import connection from "../database/databaseConfig.js";

export default {
  getFieldsByUserId,
  createField,
  deleteField,
  getLotsByFieldId,
  createLot,
  getFieldGeometry,
  getFieldLotsGeometry,
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

async function getLotsByFieldId(fieldId) {
  const query =
    "SELECT id, lot_name, area_ha, description FROM lots WHERE field_id = ? and is_active = 1";
  const [rows] = await connection.execute(query, [fieldId]);
  return rows;
}

async function createLot({
  fieldId,
  lotName,
  description,
  coordinatesPolygon,
  areaHa,
}) {
  const query =
    "INSERT INTO lots (field_id, lot_name, description, area_ha) VALUES (?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    fieldId,
    lotName,
    description,
    areaHa,
  ]);

  console.log(result);

  // Si el lote se creo, inserto las coordenadas del poligono
  if (result.affectedRows === 1) {
    try {
      let order = 1;
      for (const coord of coordinatesPolygon) {
        const insertCoordQuery =
          "INSERT INTO lot_coordinates (lot_id, latitude, longitude, point_order) VALUES (?, ?, ?, ?)";
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
      // Si hay un error al insertar las coordenadas, elimino el lote creado para evitar datos inconsistentes
      const deleteQuery = "DELETE FROM lots WHERE id = ?";
      await connection.execute(deleteQuery, [result.insertId]);
      throw error;
    }
  }
  return false;
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

async function getFieldLotsGeometry(fieldId) {
  // REVISAR
  const query =
    "SELECT l.id, l.lot_name, lc.latitude, lc.longitude, lc.point_order FROM lot_coordinates as lc JOIN lots as l ON l.id = lc.lot_id JOIN fields as f ON f.id = l.field_id WHERE field_id = ? AND l.is_active = 1 ORDER BY l.id, lc.point_order ASC";
  const [rows] = await connection.execute(query, [fieldId]);

  const lotsGeometry = {};
  rows.forEach((row) => {
    // Recorro cada fila del resultado
    if (!lotsGeometry[row.id]) {
      // Si el lote no existe en el objeto, lo inicializo con un array vacío
      lotsGeometry[row.id] = [];
    }
    lotsGeometry[row.id].push({
      // Agrego las coordenadas al array del lote correspondiente
      latitude: row.latitude,
      longitude: row.longitude,
    });
  });

  return Object.entries(lotsGeometry).map(([id, coordinatesPolygon]) => ({
    // Transformo el objeto en un array de objetos con id y coordinatesPolygon
    id: Number(id),
    lotName: rows.find((row) => row.id == id)?.lot_name || null,
    coordinatesPolygon,
  }));
}
