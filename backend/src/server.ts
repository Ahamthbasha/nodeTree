// Import env first to load environment variables
import { env } from "./config/env";
import express from "express";
import connectDB from "./config/db";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import userRouter from './routes/userRouter';
import morgan from "morgan";

const app = express();

const corsOptions: CorsOptions = {
  credentials: true,
  origin: env.FRONTEND_URL,
  methods: "GET,POST,PUT,PATCH,DELETE,HEAD",
};

// HTTP request logging
if (env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter);

// Health check route
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// 404 handler
app.use("/api", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Process-level error handling
process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Promise Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error.message);
  process.exit(1);
});

// Start server
const start = async (): Promise<void> => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    app.listen(env.PORT, () => {
      console.log(`🚀 Server is running on port ${env.PORT}`);
      console.log(`🌍 Frontend URL: ${env.FRONTEND_URL}`);
      console.log(`📝 Logging mode: ${env.NODE_ENV}`);
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Failed to start server:", errorMessage);
    process.exit(1);
  }
};

start();