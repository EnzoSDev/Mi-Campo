import express from "express";
import economyController from "../controllers/economy.controller.js";

const router = express.Router();

router.get(
  "/campaign/:campaignId",
  economyController.handlerGetCampaignEconomyData,
);
router.get("/field/:fieldId", economyController.handlerGetFieldEconomyData);
router.get("/", economyController.handlerGetEconomyData);

export default router;
