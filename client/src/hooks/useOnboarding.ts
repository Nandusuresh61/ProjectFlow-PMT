import { onboardingApi } from "@/services/onboarding/onboaring.api";
import type { CompleteOnboardingPayload, TeamInvite } from "@/types/onboarding.types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // or your toast lib

export interface OnboardingFormData {
  workspaceName: string;
  plan: "free" | "pro" | "enterprise";
  teamInvites: TeamInvite[];
}

import { AuthUserState } from "@/store/auth.store";

export function useOnboarding() {
  const navigate = useNavigate();
  const setIsOnboarded = AuthUserState((state) => state.setIsOnboarded);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormData>({
    workspaceName: "",
    plan: "free",
    teamInvites: [],
  });

  const updateForm = (updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleComplete = async (skipTeam = false) => {
    setIsSubmitting(true);
    try {
      const payload: CompleteOnboardingPayload = {
        workspaceName: formData.workspaceName,
        plan: formData.plan,
        teamInvites: skipTeam ? [] : formData.teamInvites,
      };
      await onboardingApi.complete(payload);
      setIsOnboarded(true);
      toast.success("Workspace created! Welcome to ProjectFlow.");
      navigate("/home");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.workspaceName.trim().length >= 2;
    return true;
  };

  return {
    currentStep,
    formData,
    isSubmitting,
    isStepValid,
    updateForm,
    handleNext,
    handleBack,
    handleComplete,
  };
}