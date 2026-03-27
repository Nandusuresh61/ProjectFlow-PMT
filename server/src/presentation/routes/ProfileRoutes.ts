import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { profileController } from "@/infrastructure/DI/ProfileContatiner";

const router = Router();

router.get('/',authenticatedUser,profileController.getProfile);
router.put('/',authenticatedUser,profileController.updateProfile);
router.put('/change-password',authenticatedUser, profileController.changePassword)


export default router;