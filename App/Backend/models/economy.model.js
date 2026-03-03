import connection from "../database/databaseConfig.js";

export default {
  getAllIncomesAmount,
  getAllExpensesAmount,
  getTransactionsData,
  getFieldIncomesAmount,
  getFieldExpensesAmount,
  getFieldTransactionsData,
  getCampaignIncomesAmount,
  getCampaignExpensesAmount,
  getCampaignTransactionsData,
};

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

async function getTransactionsData(userId) {
  const query = `
    SELECT 
      i.id, 
      'income' AS type, 
      f.field_name, 
      l.lot_name, 
      c.campaign_name, 
      i.concept, 
      i.amount, 
      i.date, 
      i.notes
    FROM incomes i
    JOIN fields f ON i.field_id = f.id
    JOIN lots l ON i.lot_id = l.id
    JOIN campaigns c ON i.campaign_id = c.id
    WHERE i.user_id = ? AND i.is_active = 1
    UNION ALL
    SELECT 
      e.id, 
      'expense' AS type, 
      f.field_name, 
      l.lot_name, 
      c.campaign_name, 
      e.concept, 
      e.amount, 
      e.date, 
      e.notes
    FROM expenses e
    JOIN fields f ON e.field_id = f.id
    JOIN lots l ON e.lot_id = l.id
    JOIN campaigns c ON e.campaign_id = c.id
    WHERE e.user_id = ? AND e.is_active = 1
    ORDER BY date DESC
  `;
  const [rows] = await connection.execute(query, [userId, userId]);
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

async function getFieldTransactionsData(fieldId) {
  const query = `
    SELECT 
      i.id, 
      'income' AS type, 
      f.field_name, 
      l.lot_name, 
      c.campaign_name, 
      i.concept, 
      i.amount, 
      i.date, 
      i.notes
    FROM incomes i
    JOIN fields f ON i.field_id = f.id
    JOIN lots l ON i.lot_id = l.id
    JOIN campaigns c ON i.campaign_id = c.id
    WHERE i.field_id = ? AND i.is_active = 1
    UNION ALL
    SELECT 
      e.id, 
      'expense' AS type, 
      f.field_name, 
      l.lot_name, 
      c.campaign_name, 
      e.concept, 
      e.amount, 
      e.date, 
      e.notes
    FROM expenses e
    JOIN fields f ON e.field_id = f.id
    JOIN lots l ON e.lot_id = l.id
    JOIN campaigns c ON e.campaign_id = c.id
    WHERE e.field_id = ? AND e.is_active = 1
    ORDER BY date DESC
  `;
  const [rows] = await connection.execute(query, [fieldId, fieldId]);
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

async function getCampaignTransactionsData(campaignId) {
  const query = `
    SELECT 
      i.id, 
      'income' AS type, 
      f.field_name, 
      l.lot_name, 
      c.campaign_name, 
      i.concept, 
      i.amount, 
      i.date, 
      i.notes
    FROM incomes i
    JOIN fields f ON i.field_id = f.id
    JOIN lots l ON i.lot_id = l.id
    JOIN campaigns c ON i.campaign_id = c.id
    WHERE i.campaign_id = ? AND i.is_active = 1
    UNION ALL
    SELECT 
      e.id, 
      'expense' AS type, 
      f.field_name, 
      l.lot_name, 
      c.campaign_name, 
      e.concept, 
      e.amount, 
      e.date, 
      e.notes
    FROM expenses e
    JOIN fields f ON e.field_id = f.id
    JOIN lots l ON e.lot_id = l.id
    JOIN campaigns c ON e.campaign_id = c.id
    WHERE e.campaign_id = ? AND e.is_active = 1
    ORDER BY date DESC
  `;
  const [rows] = await connection.execute(query, [campaignId, campaignId]);
  return rows;
}
