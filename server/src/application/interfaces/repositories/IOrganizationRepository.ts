import { Organization } from "@/domain/entities/org/Organization";

export interface IOrganizationRepository {
  create(org: Organization): Promise<Organization>;
}
