import { Router } from "express";
import { authController } from "../DI/AuthContainer";


const router = Router();


router.post('/register',authController.startRegister);
router.post('/verify-otp',authController.verifyOtp);

export default router;