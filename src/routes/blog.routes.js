import { Router } from "express"
import { BlogController } from "../controllers/blog.controller.js"

export const blogRoutes = Router()
const controller = BlogController()

// -> /api/blog/create
blogRoutes.post("/create", controller.create)

// -> /api/blog/list
blogRoutes.post("/list", (req, res) => { })