import { Router } from "express"
import { UserController } from "../controllers/user.controller.js"

export const userRoutes = Router()
const controller = UserController()

// -> /api/user/123
userRoutes.get("/:id", controller.getUserDetailsById)