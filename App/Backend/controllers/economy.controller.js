import economyModel from "../models/economy.model.js";

export default {
  handlerGetEconomyData,
  handlerGetFieldEconomyData,
  handlerGetCampaignEconomyData,
};

async function handlerGetEconomyData(req, res) {
  const userId = req.user.id;
  try {
    const incomes = await economyModel.getAllIncomesAmount(userId);
    const expenses = await economyModel.getAllExpensesAmount(userId);
    const incomesData = await economyModel.getAllIncomesData(userId);
    const expensesData = await economyModel.getAllExpensesData(userId);
    res.json({ incomes, expenses, incomesData, expensesData });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerGetFieldEconomyData(req, res) {
  const fieldId = req.params.fieldId;
  try {
    const incomes = await economyModel.getFieldIncomesAmount(fieldId);
    const expenses = await economyModel.getFieldExpensesAmount(fieldId);
    const incomesData = await economyModel.getFieldIncomesData(fieldId);
    const expensesData = await economyModel.getFieldExpensesData(fieldId);
    res.json({ incomes, expenses, incomesData, expensesData });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerGetCampaignEconomyData(req, res) {
  const campaignId = req.params.campaignId;
  try {
    const incomes = await economyModel.getCampaignIncomesAmount(campaignId);
    const expenses = await economyModel.getCampaignExpensesAmount(campaignId);
    const incomesData = await economyModel.getCampaignIncomesData(campaignId);
    const expensesData = await economyModel.getCampaignExpensesData(campaignId);
    res.json({ incomes, expenses, incomesData, expensesData });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
