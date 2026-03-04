import economyModel from "../models/economy.model.js";

export default {
  handlerGetCampaignEconomyData,
};

async function handlerGetCampaignEconomyData(req, res) {
  const campaignId = req.params.campaignId;
  try {
    const incomes = await economyModel.getCampaignIncomesAmount(campaignId);
    const expenses = await economyModel.getCampaignExpensesAmount(campaignId);
    const transactions =
      await economyModel.getCampaignTransactionsData(campaignId);
    res.json({ incomes, expenses, transactions });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
