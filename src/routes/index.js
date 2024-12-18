import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { blogRoutes } from "./blog.routes.js";
import { userRoutes } from "./user.routes.js";

// -> /api
export const appRouter = Router();

// -> /api/auth/login
appRouter.use("/auth", authRoutes)
appRouter.use("/blog", blogRoutes)
appRouter.use("/user", userRoutes)