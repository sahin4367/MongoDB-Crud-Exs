import { Router } from "express"
import { BlogController } from "../controllers/blog.controller.js"
import { useAuth } from "../middlewares/auth.middleware.js"

export const blogRoutes = Router()
const controller = BlogController()

// -> /api/blog/create
blogRoutes.post("/create", useAuth, controller.create)

// -> /api/blog/list
blogRoutes.get("/list",controller.getList)
// -> /api/blog/123
blogRoutes.get("/:id", useAuth ,controller.getById)


//delete : 
blogRoutes.delete("/:id", useAuth ,controller.deleteById)
//update : 
blogRoutes.put('/:id',useAuth , controller.updateById)