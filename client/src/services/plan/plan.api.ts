import type { CreatePlanPayload } from "@/types/plan.types";
import { API } from "../api";
import { API_ROUTES } from "@/constants/api.constants";

export const createPlan = async (data: CreatePlanPayload) => {
  const response = await API.post(API_ROUTES.PLAN.BASE, data);
  return response.data;
};  

export const getPlans = async () => {
  const response = await API.get(API_ROUTES.PLAN.BASE);
  return response.data;
};

export const togglePlanStatus = async (planId: string) => {
  const response = await API.patch(API_ROUTES.PLAN.TOGGLE_STATUS(planId));
  return response.data;
};
