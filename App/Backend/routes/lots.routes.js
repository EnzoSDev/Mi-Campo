import express from "express";
import lotController from "../controllers/lots.controller.js";

const router = express.Router();

router.delete("/:lotId", lotController.handleDeleteLot);
router.get("/:lotId/campaigns", lotController.handleGetCampaigns);
router.post("/:lotId/campaigns", lotController.handleCreateCampaign);

router.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default router;
