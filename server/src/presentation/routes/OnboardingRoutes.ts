import { Router } from "express";
import { onboardingController } from "@/infrastructure/DI/OnboardingContainer";
import { authenticatedUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.use(authenticatedUser);

router.post("/complete", onboardingController.completeOnboarding);
router.get("/status", onboardingController.getOnboardingStatus);

export default router;