import express from "express";
import fieldsController from "../controllers/fields.controller.js";

const router = express.Router();

router.get("/:fieldId/lots", fieldsController.handleGetFieldLots);
router.post("/:fieldId/lots", fieldsController.handleCreateLot);
router.delete("/:fieldId", fieldsController.handleDeleteField);
router.get("/:fieldId/geometry", fieldsController.handleGetFieldGeometry);
router.get(
  "/:fieldId/lots/geometry",
  fieldsController.handleGetFieldLotsGeometry,
);
router.get(
  // Ruta para obtener campañas activas por campo
  "/:fieldId/campaigns/all-active",
  fieldsController.handleGetActiveCampaignsByField,
);
router.get(
  // Ruta para obtener campañas por campo
  "/:fieldId/campaigns",
  fieldsController.handleGetCampaignsByField,
);
router.get("/", fieldsController.handleGetFields);
router.post("/", fieldsController.handleCreateField);

router.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default router;
