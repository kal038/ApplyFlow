import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import { errorHandler } from "@/middleware/errorHandler";
import { router as authRouter } from "@/routes/auth";
import { router as healthRouter } from "@/routes/health";
import { router as jobsRouter } from "@/routes/jobs";

/*
 *taxonomy of the app
 *app.ts → entry point
 *server.ts → server configuration
 *config/ → configuration files
 *middleware/ → middleware functions
 *routes/ → URL & HTTP verbs
 *controllers/ → request handling logic
 *services/ → business logic & data operations & external API calls
 *utils/ → utility functions
 *types/ → type definitions
 *tests/ → unit tests
 *assets/ → static assets
 *public/ → public assets
 */

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Syntax: "app.[HTTP_METHOD](param1, param2)"
// Param1: string -> API endpoint route literal
// Param2: controller -> fn (request, response) => {parse rquest, return response}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/jobs", jobsRouter);

// Global error handler
app.use(errorHandler);

export default app;
