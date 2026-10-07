import { Router } from "express";
import {
  getMe,
  googleLogin,
  login,
  logout,
  register,
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetOtp,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", requestPasswordReset);
router.post("/verify-reset-code", verifyPasswordResetOtp);
router.post("/reset-password", resetPassword);

export default router;
