import { Router } from "express";
import { authRoutes } from "./auth.routes.js";

// -> /api
export const appRouter = Router();

// -> /api/auth/login
appRouter.use("/auth", authRoutes)
appRouter.use("/blog", authRoutes)