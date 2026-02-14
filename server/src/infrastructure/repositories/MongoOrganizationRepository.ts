import { IOrganizationRepository } from "@/application/interfaces/repositories/IOrganizationRepository";
import { Organization } from "@/domain/entities/org/Organization";
import { OrganizationModel } from "../database/models/MongoOrganizationModel";

export class OrganizationRepository implements IOrganizationRepository {
  async create(organization: Organization): Promise<Organization> {
    const created = await OrganizationModel.create({
      organizationId: organization.organizationId,
      name: organization.name,
      ownerId: organization.ownerId,
      planId: organization.planId,
    });

    return new Organization(
      created.organizationId,
      created.name,
      created.ownerId,
      created.planId,
      created.createdAt,
      created.updatedAt,
    );
  }
}
