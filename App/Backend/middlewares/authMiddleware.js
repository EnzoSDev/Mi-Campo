import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function authMiddleware(req, res, next) {
  const token = req.token;
  if (!token) {
    return res.status(401).json({
      error: "NOT_AUTHORIZED",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // TODO: Validar que el usuario exista en la base de datos (Seguridad)
    // Agrego un campo user al objeto req para tener la info del usuario en las rutas protegidas
    req.user = {
      id: decoded.userId,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      error: "SESSION_EXPIRED",
    });
  }
}
