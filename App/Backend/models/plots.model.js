import connection from "../database/databaseConfig.js";

export default {
  getCampaignsByPlotId,
  createCampaign,
};

async function getCampaignsByPlotId(plotId) {
  const query =
    "SELECT id, campaign_name, start_date, end_date, description FROM campaigns WHERE plot_id = ? and is_active = 1";
  const [rows] = await connection.execute(query, [plotId]);
  return rows;
}

async function createCampaign({
  plotId,
  campaignName,
  startDate,
  endDate,
  description,
}) {
  const query =
    "INSERT INTO campaigns (plot_id, campaign_name, start_date, end_date, description) VALUES (?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    plotId,
    campaignName,
    startDate,
    endDate,
    description,
  ]);
  return result.affectedRows === 1;
}
