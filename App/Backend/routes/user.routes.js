import express from "express";
import userController from "../controllers/user.controller.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/login", userController.handlerLogin);
router.post("/register", userController.handlerRegister);
router.get("/country-codes", userController.handlerGetCountryCodes);
router.get("/validate-session", userController.handlerValidateSession);
router.get("/data", userController.handlerGetData);
router.put("/username", userController.handlerUpdateUsername);
router.put("/change-password", userController.handlerChangePassword);
router.put(
  "/update-profile-image",
  upload.single("profileImage"),
  userController.handlerUpdateProfileImage,
);
router.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default router;
