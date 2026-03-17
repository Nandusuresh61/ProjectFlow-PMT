import type { CompleteOnboardingPayload } from "@/types/onboarding.types";
import { API } from "../api";
import { API_ROUTES } from "@/constants/api.constants";

import type { ApiResponse } from "@/types/auth.types";

export const completeOnboarding = async (
  payload: CompleteOnboardingPayload,
): Promise<ApiResponse<{ workspaceId: string }>> => {
  const { data } = await API.post<ApiResponse<{ workspaceId: string }>>(
    API_ROUTES.ONBOARDING.COMPLETE,
    payload,
  );

  return data;
};
