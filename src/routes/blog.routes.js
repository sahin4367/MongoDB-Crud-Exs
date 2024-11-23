import { Router } from "express"

export const blogRoutes = Router()

// -> /api/blog/create
blogRoutes.post("/create", (req, res) => { })

// -> /api/blog/list
blogRoutes.post("/list", (req, res) => { })