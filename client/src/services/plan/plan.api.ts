import type { CreatePlanPayload } from "@/types/plan.types";
import { API } from "../api";

export const createPlan = async (data: CreatePlanPayload) => {
  const response = await API.post("/plan", data);
  return response.data;
};

export const getPlans = async () => {
  const response = await API.get("/plan");
  return response.data;
};

export const togglePlanStatus = async (planId: string) => {
  const response = await API.patch(`/plan/${planId}/toggle`);
  return response.data;
};
