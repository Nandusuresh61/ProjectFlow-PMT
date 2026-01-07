import { Router } from "express";
import { authController } from "../DI/AuthContainer";


const router = Router();


router.post('/register',authController.register);

export default router;