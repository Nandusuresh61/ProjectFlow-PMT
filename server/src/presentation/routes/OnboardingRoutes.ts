import { Router } from "express";
import { onboardingController } from "@/infrastructure/DI/OnboardingContainer";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
const router = Router();


router.post("/complete",authenticatedUser,onboardingController.completeOnboarding);

export default router