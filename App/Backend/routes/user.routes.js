import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", userController.handlerLogin);
router.post("/register", userController.handlerRegister);
router.get("/country-codes", userController.handlerGetCountryCodes);
router.get("/validate-session", userController.handlerValidateSession);
router.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default router;
