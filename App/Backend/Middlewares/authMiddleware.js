import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export function authMiddleware (req, res, next) {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(401).json({
      error: 'NOT_AUTHORIZED'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user_id = decoded.user_id
    next()
  } catch (error) {
    return res.status(401).json({
      error: 'SESSION_EXPIRED'
    })
  }
}
