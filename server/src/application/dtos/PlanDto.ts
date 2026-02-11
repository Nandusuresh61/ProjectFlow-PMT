export interface CreatePlanDto {
  name: string;
  priceMonthly: number;
  description: string;
  maxProjects: number;
  maxMembers: number;
  features: string[];
}
