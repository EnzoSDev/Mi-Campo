import express from "express";
import newsController from "../controllers/news.controller.js";

const router = express.Router();

router.get("/", newsController.handlerGetNews);

router.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default router;
