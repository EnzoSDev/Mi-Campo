import connection from "../database/databaseConfig.js";

export default {
  getAllIncomesAmount,
  getAllExpensesAmount,
  getAllIncomesData,
  getAllExpensesData,
  getFieldIncomesAmount,
  getFieldExpensesAmount,
  getFieldIncomesData,
  getFieldExpensesData,
  getCampaignIncomesAmount,
  getCampaignExpensesAmount,
  getCampaignIncomesData,
  getCampaignExpensesData,
};

async function getAllIncomesAmount(userId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM incomes WHERE user_id = ?",
    [userId],
  );
  return rows[0].total || 0;
}

async function getAllExpensesAmount(userId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM expenses WHERE user_id = ?",
    [userId],
  );
  return rows[0].total || 0;
}

async function getAllIncomesData(userId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM incomes WHERE user_id = ?",
    [userId],
  );
  return rows;
}

async function getAllExpensesData(userId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM expenses WHERE user_id = ?",
    [userId],
  );
  return rows;
}

async function getFieldIncomesAmount(fieldId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM incomes WHERE field_id = ?",
    [fieldId],
  );
  return rows[0].total || 0;
}

async function getFieldExpensesAmount(fieldId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM expenses WHERE field_id = ?",
    [fieldId],
  );
  return rows[0].total || 0;
}

async function getFieldIncomesData(fieldId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM incomes WHERE field_id = ?",
    [fieldId],
  );
  return rows;
}

async function getFieldExpensesData(fieldId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM expenses WHERE field_id = ?",
    [fieldId],
  );
  return rows;
}

async function getCampaignIncomesAmount(campaignId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM incomes WHERE campaign_id = ?",
    [campaignId],
  );
  return rows[0].total || 0;
}

async function getCampaignExpensesAmount(campaignId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM expenses WHERE campaign_id = ?",
    [campaignId],
  );
  return rows[0].total || 0;
}

async function getCampaignIncomesData(campaignId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM incomes WHERE campaign_id = ?",
    [campaignId],
  );
  return rows;
}

async function getCampaignExpensesData(campaignId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM expenses WHERE campaign_id = ?",
    [campaignId],
  );
  return rows;
}
