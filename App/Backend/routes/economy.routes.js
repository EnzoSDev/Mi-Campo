import express from "express";
import economyController from "../controllers/economy.controller.js";

const router = express.Router();

router.get("/filters", economyController.handlerGetFilters);
router.get(
  "/campaignId/:campaignId",
  economyController.handlerGetCampaignEconomyData,
);
router.get("/fieldId/:fieldId", economyController.handlerGetFieldEconomyData);
router.get("/", economyController.handlerGetEconomyData);

export default router;
