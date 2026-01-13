import connection from '../Database/databaseConfig.js'

export default {
  getFieldsByUserId,
  createField
}

async function getFieldsByUserId (userId) {
  const query = 'SELECT id, field_name, description, location_name, area_ha, lat, lng, coordinates_polygon FROM fields WHERE user_id = ?'
  const [rows] = await connection.execute(query, [userId])
  return rows
}

async function createField ({ userId, fieldName, description, locationName, lat, lng, coordinatesPolygon, areaHa }) {
  const query = 'INSERT INTO fields (user_id, field_name, description, location_name, lat, lng, coordinates_polygon, area_ha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  const [result] = await connection.execute(query, [userId, fieldName, description, locationName, lat, lng, JSON.stringify(coordinatesPolygon), areaHa])
  return result.affectedRows === 1
}
