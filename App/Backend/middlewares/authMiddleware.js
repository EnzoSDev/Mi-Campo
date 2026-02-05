import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../models/user.model.js";

dotenv.config();

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "NOT_AUTHORIZED",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    try {
      const userActive = await userModel.userActive(decoded.userId);
      if (!userActive) {
        return res.status(401).json({
          message: "USER_INACTIVE",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "INTERNAL_SERVER_ERROR",
      });
    }
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
