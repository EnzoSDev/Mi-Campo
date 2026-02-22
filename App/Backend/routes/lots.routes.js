import express from "express";
import lotController from "../controllers/lots.controller.js";

const router = express.Router();

router.delete("/:lotId", lotController.handleDeleteLot);
router.get("/:lotId/campaigns/active", lotController.handleGetActiveCampaign);
router.get("/:lotId/campaigns", lotController.handleGetCampaigns);
router.post("/:lotId/campaigns/create", lotController.handleCreateCampaign); // Endpoint para crear una campaña
router.post("/:lotId/campaigns/join", lotController.handleJoinCampaign); // Endpoint para unirse a una campaña existente

router.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default router;
