import { Router } from "express"
import { AuthContoller } from "../controllers/auth.contoller.js"
import { useAuth } from "../middlewares/auth.middleware.js"

export const authRoutes = Router()

const contoller = AuthContoller()

// -> /api/auth/login
authRoutes.post("/login", contoller.login)
authRoutes.post("/register", contoller.register)
authRoutes.post("/verify/email", useAuth, contoller.verifyEmail)
authRoutes.post("/verify/email/check", useAuth, contoller.checkEmailCode)