import connection from "../database/databaseConfig.js";

export default {
  getFilters,
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

async function getFilters(userId) {
  const query = `
    SELECT f.id as field_id, f.field_name, l.id as lot_id, l.lot_name, c.id as campaign_id, c.campaign_name
    FROM fields as f
    LEFT JOIN lots as l ON f.id = l.field_id
    LEFT JOIN campaign_lots as cl ON l.id = cl.lot_id
    LEFT JOIN campaigns as c ON cl.campaign_id = c.id
    WHERE f.user_id = ? and f.is_active = 1 and (l.is_active = 1 OR l.id IS NULL) and (c.status = 'active' OR c.id IS NULL)
  `;
  const [rows] = await connection.execute(query, [userId]);
  return rows;
}

async function getAllIncomesAmount(userId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM incomes WHERE user_id = ? AND is_active = 1",
    [userId],
  );
  return rows[0].total || 0;
}

async function getAllExpensesAmount(userId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM expenses WHERE user_id = ? AND is_active = 1",
    [userId],
  );
  return rows[0].total || 0;
}

async function getAllIncomesData(userId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM incomes WHERE user_id = ? AND is_active = 1",
    [userId],
  );
  return rows;
}

async function getAllExpensesData(userId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM expenses WHERE user_id = ? AND is_active = 1",
    [userId],
  );
  return rows;
}

async function getFieldIncomesAmount(fieldId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM incomes WHERE field_id = ? AND is_active = 1",
    [fieldId],
  );
  return rows[0].total || 0;
}

async function getFieldExpensesAmount(fieldId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM expenses WHERE field_id = ? AND is_active = 1",
    [fieldId],
  );
  return rows[0].total || 0;
}

async function getFieldIncomesData(fieldId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM incomes WHERE field_id = ? AND is_active = 1",
    [fieldId],
  );
  return rows;
}

async function getFieldExpensesData(fieldId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM expenses WHERE field_id = ? AND is_active = 1",
    [fieldId],
  );
  return rows;
}

async function getCampaignIncomesAmount(campaignId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM incomes WHERE campaign_id = ? AND is_active = 1",
    [campaignId],
  );
  return rows[0].total || 0;
}

async function getCampaignExpensesAmount(campaignId) {
  const [rows] = await connection.execute(
    "SELECT SUM(amount) AS total FROM expenses WHERE campaign_id = ? AND is_active = 1",
    [campaignId],
  );
  return rows[0].total || 0;
}

async function getCampaignIncomesData(campaignId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM incomes WHERE campaign_id = ? AND is_active = 1",
    [campaignId],
  );
  return rows;
}

async function getCampaignExpensesData(campaignId) {
  const [rows] = await connection.execute(
    "SELECT concept, amount, date, notes FROM expenses WHERE campaign_id = ? AND is_active = 1",
    [campaignId],
  );
  return rows;
}
