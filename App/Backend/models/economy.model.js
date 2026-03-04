import connection from "../database/databaseConfig.js";

export default {
  getCampaignIncomesAmount,
  getCampaignExpensesAmount,
  getCampaignTransactionsData,
};

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

async function getCampaignTransactionsData(campaignId) {
  const query = `
    SELECT
      ic.description,
      'income' AS type,  
      i.concept, 
      i.amount, 
      i.date, 
      i.notes
    FROM incomes i
    JOIN income_categories ic ON i.income_category_id = ic.id
    WHERE campaign_id = ?
    UNION ALL
    SELECT
      ec.description,
      'expense' AS type,
      e.concept, 
      e.amount, 
      e.date, 
      e.notes
    FROM expenses e
    JOIN expense_categories ec ON e.expense_category_id = ec.id
    WHERE campaign_id = ?
    ORDER BY date DESC
  `;
  const [rows] = await connection.execute(query, [campaignId, campaignId]);
  return rows;
}
