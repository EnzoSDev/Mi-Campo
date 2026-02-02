import express from "express";
import userController from "../Controllers/user.controller.js";

const router = express.Router();

router.post("/login", userController.handlerLogin);
router.post("/register", userController.handlerRegister);

router.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default router;
