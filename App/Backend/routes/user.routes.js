import express from "express";
import userController from "../controllers/user.controller.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", userController.handlerLogin);
router.post("/register", userController.handlerRegister);
router.get("/country-codes", userController.handlerGetCountryCodes);
router.get("/validate-session", userController.handlerValidateSession);
router.get("/data", authMiddleware, userController.handlerGetData);
router.put("/username", authMiddleware, userController.handlerUpdateUsername);
router.put(
  "/change-password",
  authMiddleware,
  userController.handlerChangePassword,
);
router.put(
  "/update-profile-image",
  authMiddleware,
  upload.single("profileImage"),
  userController.handlerUpdateProfileImage,
);
router.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default router;
