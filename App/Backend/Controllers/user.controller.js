import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../Models/user.model.js";

dotenv.config();

export default {
  handlerLogin,
  handlerRegister,
};

async function handlerLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }
    const userId = user.id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ token, message: "Inicio de sesión exitoso" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerRegister(req, res) {
  const { username, email, password, passwordConfirm, countryCode } = req.body;
  if (!username || !email || !password || !passwordConfirm || !countryCode) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }
  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "Las contraseñas no coinciden" });
  }
  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "El email ya está registrado" });
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
