export interface CreatePlanPayload {
  type: string;
  priceMonthly: number;
  description: string;
  maxProjects?: number;
  maxMembers?: number;
  features: string[];
}

export interface Plan {
  planId: string;
  type: string;
  priceMonthly: number;
  description: string;
  maxProjects: number;
  maxMembers: number;
  features: string[];
  isActive: boolean;
  popular: boolean;
}