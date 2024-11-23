import { Router } from "express"
import { AuthContoller } from "../controllers/auth.contoller.js"

export const authRoutes = Router()

const contoller = AuthContoller()

// -> /api/auth/login
authRoutes.post("/login", contoller.login)
authRoutes.post("/register", contoller.register)