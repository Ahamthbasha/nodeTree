import { env } from "./config/env.js";
import express from "express";
import connectDB from "./config/db.js";
import cors, {} from "cors";
import cookieParser from "cookie-parser";
import userRouter from './routes/userRouter.js';
import morgan from "morgan";
const app = express();
const corsOptions = {
    credentials: true,
    origin: env.FRONTEND_URL,
    methods: "GET,POST,PUT,PATCH,DELETE,HEAD",
};
if (env.NODE_ENV === "production") {
    app.use(morgan("combined"));
}
else {
    app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRouter);
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});
app.use("/api", (_req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
    });
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Promise Rejection:", reason);
    process.exit(1);
});
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error.message);
    process.exit(1);
});
const start = async () => {
    try {
        await connectDB();
        console.log("✅ Database connected successfully");
        app.listen(env.PORT, () => {
            console.log(`🚀 Server is running on port ${env.PORT}`);
            console.log(`🌍 Frontend URL: ${env.FRONTEND_URL}`);
            console.log(`📝 Logging mode: ${env.NODE_ENV}`);
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ Failed to start server:", errorMessage);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map