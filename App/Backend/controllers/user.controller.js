import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

dotenv.config();

export default {
  handlerLogin,
  handlerGetCountryCodes,
  handlerRegister,
  handlerValidateSession,
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
