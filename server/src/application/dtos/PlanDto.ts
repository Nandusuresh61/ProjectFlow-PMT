export interface CreatePlanDto {
  type: string;
  priceMonthly: number;
  description: string;
  maxProjects: number;
  maxMembers: number;
  features: string[];
}
