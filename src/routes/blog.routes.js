import { Router } from "express"
import { BlogController } from "../controllers/blog.controller.js"
import { useAuth } from "../middlewares/auth.middleware.js"

export const blogRoutes = Router()
const controller = BlogController()

// -> /api/blog/create
blogRoutes.post("/create", useAuth, controller.create)

// -> /api/blog/list
blogRoutes.get("/list", (req, res) => {
    console.log("SALAM");
    res.send("Blog List")
})