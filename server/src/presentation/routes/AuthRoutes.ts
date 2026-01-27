import { Router } from "express";
import { authController } from "@/infrastructure/DI/AuthContainer";

import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { config } from "@/app.config";

const router = Router();

router.post("/register", authController.startRegister);
router.post("/login", authController.loginUser);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/logout", authController.LogoutUser);
router.post(config.REFRESH_TOKEN_PATH, authController.refreshToken);
router.get("/getme", authenticatedUser, authController.getMe);
router.post("/forgot",authController.forgotOtp);
router.post("/reset-password",authController.resetPassword);
export default router;
