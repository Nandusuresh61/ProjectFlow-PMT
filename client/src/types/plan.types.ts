export interface CreatePlanPayload {
  name: string;
  priceMonthly: number;
  description: string;
  maxProjects: number;
  maxMembers: number;
  features: string[];
}

export interface Plan {
  planId: string;
  name: string;
  priceMonthly: number;
  description: string;
  maxProjects: number;
  maxMembers: number;
  features: string[];
  isActive: boolean;
  popular: boolean;
}