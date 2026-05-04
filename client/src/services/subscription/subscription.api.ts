import { API } from "../api";

export const getSubscription = async (workspaceId: string) => {
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
