import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());

await connectDB();

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Todo API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
