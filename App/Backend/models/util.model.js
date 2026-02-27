import connection from "../database/databaseConfig.js";

export default {
  getActivities,
  registerActivity,
};

async function getActivities(userId, types, entity, entityId, limit, order) {
  /*
        userId: ID del usuario para filtrar actividades relacionadas a ese usuario
        types: Array de tipos de actividades a incluir (e.g., ["sowing", "fertilization"])
        entity: Tipo de entidad relacionada (e.g., "campaign", "lot")
        entityId: ID de la entidad específica para filtrar actividades (Puede ser null por si no tiene entidad en la BD)
        limit: Número máximo de actividades a retornar
        order: Orden de las actividades por fecha ("asc" o "desc")

    */
  const typesCondition = types.map((t) => `type = '${t}'`).join(" OR ");
  const query =
    "SELECT type, description, created_at as date FROM activities WHERE user_id = ? AND entity = ? AND entity_id = ? AND (" +
    typesCondition +
    ") ORDER BY created_at " +
    (order === "asc" ? "ASC" : "DESC") +
    " LIMIT ?";
  const [rows] = await connection.execute(query, [
    userId,
    entity,
    entityId,
    limit,
  ]);
  return rows;
}

async function registerActivity(
  userId,
  type,
  description,
  entity,
  entityId,
  date,
) {
  const query =
    "INSERT INTO activities (user_id, type, description, entity, entity_id, date) VALUES (?, ?, ?, ?, ?, ?)";
  await connection.execute(query, [
    userId,
    type,
    description,
    entity,
    entityId,
    date,
  ]);
}
