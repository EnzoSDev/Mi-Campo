import connection from "../database/databaseConfig.js";

export const campaignModel = {
  getSowingsByCampaignId,
  registerSowing,
  getFertilizationsByCampaignId,
  registerFertilization,
  getSprayingsByCampaignId,
  registerSpraying,
  getHarvestsByCampaignId,
  registerHarvest,
  getObservationsByCampaignId,
  registerObservation,
};

async function getSowingsByCampaignId(campaignId) {
  const query =
    "SELECT id, crop_type, variety, sowing_date, density, row_spacing, method, notes FROM sowings WHERE campaign_id = ?";
  const [rows] = await connection.execute(query, [campaignId]);
  return rows;
}

async function registerSowing(
  campaignId,
  cropType,
  variety,
  sowingDate,
  density,
  rowSpacing,
  method,
  notes,
) {
  const query =
    "INSERT INTO sowings (campaign_id, crop_type, variety, sowing_date, density, row_spacing, method, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    campaignId,
    cropType,
    variety,
    sowingDate,
    density,
    rowSpacing,
    method,
    notes,
  ]);
  return result.affectedRows === 1;
}

async function getFertilizationsByCampaignId(campaignId) {
  const query =
    "SELECT id, product_name, dose, date_applied, method, notes FROM fertilizations WHERE campaign_id = ?";
  const [rows] = await connection.execute(query, [campaignId]);
  return rows;
}

async function registerFertilization(
  campaignId,
  productName,
  dose,
  dateApplied,
  method,
  notes,
) {
  const query =
    "INSERT INTO fertilizations (campaign_id, product_name, dose, date_applied, method, notes) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    campaignId,
    productName,
    dose,
    dateApplied,
    method,
    notes,
  ]);
  return result.affectedRows === 1;
}

async function getSprayingsByCampaignId(campaignId) {
  const query =
    "SELECT id, product_name, dose, date_applied, method, notes FROM sprayings WHERE campaign_id = ?";
  const [rows] = await connection.execute(query, [campaignId]);
  return rows;
}

async function registerSpraying(
  campaignId,
  productName,
  dose,
  dateApplied,
  target,
  method,
  notes,
) {
  const query =
    "INSERT INTO sprayings (campaign_id, product_name, dose, date_applied, target, method, notes) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    campaignId,
    productName,
    dose,
    dateApplied,
    target,
    method,
    notes,
  ]);
  return result.affectedRows === 1;
}

async function getHarvestsByCampaignId(campaignId) {
  const query =
    "SELECT id, harvest_date, total_yield_kg, moisture_percentage, notes FROM harvests WHERE campaign_id = ?";
  const [rows] = await connection.execute(query, [campaignId]);
  return rows;
}

async function registerHarvest(
  campaignId,
  harvestDate,
  totalYieldKg,
  moisturePercentage,
  notes,
) {
  const query =
    "INSERT INTO harvests (campaign_id, harvest_date, total_yield_kg, moisture_percentage, notes) VALUES (?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    campaignId,
    harvestDate,
    totalYieldKg,
    moisturePercentage,
    notes,
  ]);
  return result.affectedRows === 1;
}

async function getObservationsByCampaignId(campaignId) {
  const query =
    "SELECT id, observation_date, note FROM observations WHERE campaign_id = ?";
  const [rows] = await connection.execute(query, [campaignId]);
  return rows;
}

async function registerObservation(campaignId, observationDate, note) {
  const query =
    "INSERT INTO observations (campaign_id, observation_date, note) VALUES (?, ?, ?)";
  const [result] = await connection.execute(query, [
    campaignId,
    observationDate,
    note,
  ]);
  return result.affectedRows === 1;
}
