import { Router } from "express";
import { authController } from "@/infrastructure/DI/AuthContainer";

import { authenticatedUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.post("/register", authController.startRegister);
router.post("/login", authController.loginUser);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/logout", authController.LogoutUser);
router.post("/refresh", authController.refreshToken);
router.get("/getme", authenticatedUser, authController.getMe);

export default router;
