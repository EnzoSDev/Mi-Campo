import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import userModel from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export default {
  handlerLogin,
  handlerGetCountryCodes,
  handlerRegister,
  handlerValidateSession,
  handlerGetData,
  handlerUpdateUsername,
  handlerChangePassword,
  handlerUpdateProfileImage,
};

async function handlerValidateSession(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token de autenticación requerido" });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ sessionActive: true });
  } catch (error) {
    res
      .status(401)
      .json({ sessionActive: false, message: "Token inválido o expirado" });
  }
}

async function handlerLogin(req, res) {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }
  try {
    const user = await userModel.findUserByEmail(email);
    console.log("User found:", user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hashed,
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ token, message: "Inicio de sesión exitoso" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error interno del servidor" });
  }
}

async function handlerGetCountryCodes(req, res) {
  try {
    const countryCodes = await userModel.getCountryCodes();
    res.status(200).json({ countryCodes });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerRegister(req, res) {
  const { username, email, password, passwordConfirm, countryCode } = req.body;
  if (!username || !email || !password || !passwordConfirm || !countryCode) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "El email no es válido" });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "Las contraseñas no coinciden" });
  }
  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      try {
        const res = await userModel.userActive(existingUser.id);
        if (!res) {
          return res.status(403).json({ message: "El usuario está inactivo" }); //TODO: La idea es preguntarle al usuario si quiere reactivar la cuenta
        }
        return res.status(409).json({ message: "El email ya está registrado" });
      } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.createUser({
      username,
      email,
      passwordHash: hashedPassword,
      countryCode,
    });
    if (result) {
      res.status(201).json({ message: "Usuario registrado exitosamente" });
    } else res.status(500).json({ message: "No se pudo registrar el usuario" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerGetData(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token de autenticación requerido" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const userData = await userModel.getUserData(userId);
    res.status(200).json(userData);
  } catch (error) {
    res.status(401).json({ message: "Sesión inválida o expirada" });
  }
}

async function handlerUpdateUsername(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token de autenticación requerido" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { newUsername } = req.body;
    if (!newUsername) {
      return res
        .status(400)
        .json({ message: "El nuevo nombre de usuario es requerido" });
    }
    await userModel.updateUsername(userId, newUsername);
    res
      .status(200)
      .json({ message: "Nombre de usuario actualizado exitosamente" });
  } catch (error) {
    res.status(401).json({ message: "Sesión inválida o expirada" });
  }
}

async function handlerChangePassword(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token de autenticación requerido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }

    if (newPassword !== newPasswordConfirm) {
      return res
        .status(400)
        .json({ message: "Las nuevas contraseñas no coinciden" });
    }

    const user = await userModel.findUserById(userId);
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hashed,
    );

    if (!isCurrentPasswordValid) {
      return res
        .status(401)
        .json({ message: "La contraseña actual es incorrecta" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userModel.changePassword(userId, hashedNewPassword);
    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(401).json({ message: "Sesión inválida o expirada" });
  }
}

async function handlerUpdateProfileImage(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token de autenticación requerido" });
  }

  const token = authHeader.split(" ")[1];
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!imageUrl) {
    return res.status(400).json({ message: "No se proporcionó una imagen" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    await userModel.updateProfileImage(userId, imageUrl);
    res.status(200).json({
      message: "Foto de perfil actualizada exitosamente",
      profile_image: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la foto de perfil" });
  }
}
