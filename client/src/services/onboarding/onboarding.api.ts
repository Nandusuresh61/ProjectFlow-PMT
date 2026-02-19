import type { CompleteOnboardingPayload } from "@/types/onboarding.types";
import { API } from "../api";

import type { ApiResponse } from "@/types/auth.types";

export const completeOnboarding = async (
  payload: CompleteOnboardingPayload,
): Promise<ApiResponse<{ workspaceId: string }>> => {
  const { data } = await API.post<ApiResponse<{ workspaceId: string }>>(
    "/onboarding/complete",
    payload,
  );

  return data;
};
