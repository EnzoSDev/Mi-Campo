import express from "express";
import fieldsController from "../controllers/fields.controller.js";

const router = express.Router();

router.get("/:fieldId/plots", fieldsController.handleGetFieldPlots);
router.post("/:fieldId/plots", fieldsController.handleCreatePlot);
router.get("/", fieldsController.handleGetFields);
router.post("/", fieldsController.handleCreateField);
router.delete("/:fieldId", fieldsController.handleDeleteField);

router.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default router;
