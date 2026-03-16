import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { profileConroller } from "@/infrastructure/DI/ProfileContatiner";

const router = Router();

router.get('/',authenticatedUser,profileConroller.getProfile);
router.patch('/',authenticatedUser,profileConroller.updateProfile)


export default router;