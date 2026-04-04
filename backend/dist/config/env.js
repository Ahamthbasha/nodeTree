import dotenv from "dotenv";
import path from "path";
const envFile = process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
const requiredEnvVars = [
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "MONGO_URI"
];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});
export const env = {
    PORT: parseInt(process.env.PORT || "3000", 10),
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || "15m",
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || "7d",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    NODE_ENV: process.env.NODE_ENV || "development",
};
//# sourceMappingURL=env.js.map