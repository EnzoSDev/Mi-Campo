import connection from "../database/databaseConfig.js";

export default {
  getLotById,
  deleteLot,
  getActiveCampaignByLotId,
  getCompletedCampaignsByLotId,
  createCampaign,
  JoinCampaign,
};

async function getLotById(lotId) {
  const query = "SELECT * FROM lots WHERE id = ?";
  const [rows] = await connection.execute(query, [lotId]);
  return rows.length > 0 ? rows[0] : null;
}

async function deleteLot(lotId) {
  const query = "UPDATE lots SET is_active = 0 WHERE id = ?";
  const [result] = await connection.execute(query, [lotId]);
  return result.affectedRows === 1;
}

async function getActiveCampaignByLotId(lotId) {
  const query =
    "SELECT c.id, c.campaign_name, c.start_date, c.end_date, c.description FROM campaigns c JOIN campaign_lots cl ON c.id = cl.campaign_id WHERE cl.lot_id = ? AND c.is_active = 1 AND c.status = 'active' AND cl.is_active = 1";
  const [rows] = await connection.execute(query, [lotId]);
  return rows.length > 0 ? rows[0] : null;
}

async function getCompletedCampaignsByLotId(lotId) {
  const query =
    "SELECT c.id, c.campaign_name, c.start_date, c.end_date, c.description FROM campaigns c JOIN campaign_lots cl ON c.id = cl.campaign_id WHERE cl.lot_id = ? AND c.is_active = 1 AND c.status = 'completed' AND cl.is_active = 1";
  const [rows] = await connection.execute(query, [lotId]);
  return rows;
}

async function createCampaign({
  lotId,
  campaignName,
  startDate,
  endDate,
  description,
}) {
  const query =
    "INSERT INTO campaigns (campaign_name, start_date, end_date, description) VALUES (?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    campaignName,
    startDate,
    endDate,
    description,
  ]);
  if (result.affectedRows === 1) {
    const campaignId = result.insertId;
    const linkQuery =
      "INSERT into campaign_lots (campaign_id, lot_id) VALUES (?, ?)";
    const [linkResult] = await connection.execute(linkQuery, [
      campaignId,
      lotId,
    ]);
    return linkResult.affectedRows === 1;
  } else {
    const deleteQuery = "DELETE FROM campaigns WHERE id = ?";
    await connection.execute(deleteQuery, [result.insertId]);
    return false;
  }
}

async function JoinCampaign(lotId, campaignId) {
  const query = "INSERT INTO campaign_lots (campaign_id, lot_id) VALUES (?, ?)";
  const [result] = await connection.execute(query, [campaignId, lotId]);
  return result.affectedRows === 1;
}
