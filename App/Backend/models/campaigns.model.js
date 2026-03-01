import connection from "../database/databaseConfig.js";

export const campaignModel = {
  unlinkLotFromCampaign,
  completeCampaign,
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
  getExpenseCategories,
  registerExpense,
  getIncomeCategories,
  registerIncome,
};

async function unlinkLotFromCampaign(campaignId, lotId) {
  const query =
    "UPDATE campaign_lots SET is_active = 0 WHERE campaign_id = ? AND lot_id = ?";
  const [result] = await connection.execute(query, [campaignId, lotId]);
  return result.affectedRows === 1;
}

async function completeCampaign(campaignId) {
  const query = "UPDATE campaigns SET status = 'completed' WHERE id = ?";
  const [result] = await connection.execute(query, [campaignId]);
  return result.affectedRows === 1;
}

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

async function getExpenseCategories() {
  const query = "SELECT id, description FROM expense_categories";
  const [rows] = await connection.execute(query);
  return rows;
}

async function registerExpense(
  campaignId,
  categoryId,
  concept,
  amount,
  date,
  notes,
) {
  const query =
    "INSERT INTO expenses (campaign_id, expense_category_id, concept, amount, date, notes) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    campaignId,
    categoryId,
    concept,
    amount,
    date,
    notes,
  ]);
  return result.affectedRows === 1;
}

async function getIncomeCategories() {
  const query = "SELECT id, description FROM income_categories";
  const [rows] = await connection.execute(query);
  return rows;
}

async function registerIncome(
  campaignId,
  categoryId,
  concept,
  amount,
  date,
  notes,
) {
  const query =
    "INSERT INTO incomes (campaign_id, income_category_id, concept, amount, date, notes) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await connection.execute(query, [
    campaignId,
    categoryId,
    concept,
    amount,
    date,
    notes,
  ]);
  return result.affectedRows === 1;
}
