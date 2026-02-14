import type { CompleteOnboardingPayload } from "@/types/onboarding.types";
import { API } from "../api";

import type { ApiResponse } from "@/types/auth.types";

export const completeOnboarding = async (
  payload: CompleteOnboardingPayload,
): Promise<ApiResponse<{ organizationId: string }>> => {
  const { data } = await API.post<ApiResponse<{ organizationId: string }>>(
    "/onboarding/complete",
    payload,
  );

  return data;
};
