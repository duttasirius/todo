import { Router } from "express";
import { generateTodo } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/todo", protect, generateTodo);

export default router;
