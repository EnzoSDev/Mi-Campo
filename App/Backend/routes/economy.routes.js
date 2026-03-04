import express from "express";
import economyController from "../controllers/economy.controller.js";

const router = express.Router();

router.get(
  "/campaign/:campaignId",
  economyController.handlerGetCampaignEconomyData,
);

router.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default router;
