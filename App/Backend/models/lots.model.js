import connection from "../database/databaseConfig.js";

export default {
  deleteLot,
  getCampaignsByLotId,
  createCampaign,
};

async function deleteLot(lotId) {
  const query = "UPDATE lots SET is_active = 0 WHERE id = ?";
  const [result] = await connection.execute(query, [lotId]);
  return result.affectedRows === 1;
}

async function getCampaignsByLotId(lotId) {
  const query =
    "SELECT id, campaign_name, start_date, end_date, description FROM campaigns WHERE lot_id = ? and is_active = 1";
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
    "INSERT INTO campaigns (lot_id, campaign_name, start_date, end_date, description) VALUES (?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    lotId,
    campaignName,
    startDate,
    endDate,
    description,
  ]);
  return result.affectedRows === 1;
}
