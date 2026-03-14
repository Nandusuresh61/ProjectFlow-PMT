export class Plan {
  constructor(
    public readonly planId: string,
    public name: string,
    public priceMonthly: number,
    public description: string,
    public maxProjects: number,
    public maxMembers: number,
    public features: string[],
    public isActive: boolean,
    public createdAt: Date,
    public updatedat: Date,
  ) {}
}
