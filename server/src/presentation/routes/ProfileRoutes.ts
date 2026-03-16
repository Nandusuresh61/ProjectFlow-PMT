import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { profileConroller } from "@/infrastructure/DI/ProfileContatiner";

const router = Router();

router.get('/',authenticatedUser,profileConroller.getProfile);


export default router;