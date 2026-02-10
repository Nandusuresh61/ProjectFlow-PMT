import type { CompleteOnboardingPayload, OnboardingStatusResponse } from "@/types/onboarding.types";
import { API } from "../api";


export const onboardingApi = {
  complete: async (payload: CompleteOnboardingPayload) => {
    const { data } = await API.post("/onboarding/complete", payload);
    return data;
  },

  getStatus: async (): Promise<OnboardingStatusResponse> => {
    const { data } = await API.get("/onboarding/status");
    return data.data;
  },
};