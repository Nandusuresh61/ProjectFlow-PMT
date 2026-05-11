import { API } from "../api";
import type { Plan } from "@/types/plan.types";

export interface SubscriptionDetail {
  subscriptionId: string;
  workspaceId: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string;
  billingCycle: string;
  createdAt?: string;
  razorpayPaymentId?: string;
  amount: number;
  planType?: string;
}

export type SubscriptionHistoryItem = SubscriptionDetail;

export interface SubscriptionResponse {
  plan: Plan;
  subscription: SubscriptionDetail;
  usage: {
    projects: number;
    members: number;
  };
  history: SubscriptionHistoryItem[];
}

export const getSubscription = async (workspaceId: string): Promise<{ data: SubscriptionResponse }> => {
  const response = await API.get(`/subscription/${workspaceId}`);
  return response.data;
};

export const upgradeSubscription = async (workspaceId: string, planId: string) => {
  const response = await API.post(`/subscription/${workspaceId}/upgrade`, { planId });
  return response.data;
};

export const verifyPayment = async (workspaceId: string, data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  planId: string;
}) => {
  const response = await API.post(`/subscription/${workspaceId}/verify`, data);
  return response.data;
};
