import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import aiRoutes from "./routes/ai.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

await connectDB();

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Todo API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/ai", aiRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
