import { Router } from "express";
import { authController } from "@/infrastructure/DI/AuthContainer";

const router = Router();


router.post('/register',authController.startRegister);
router.post('/login',authController.loginUser)
router.post('/verify-otp',authController.verifyOtp);
router.post('/resend-otp',authController.resendOtp)

export default router;