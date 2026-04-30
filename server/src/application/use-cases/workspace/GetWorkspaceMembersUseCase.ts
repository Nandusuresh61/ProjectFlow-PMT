import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IGetWorkspaceMembersUseCase } from "@/application/interfaces/use-cases/workspace/IGetWorkspaceMembersUseCase";

export class GetWorkspaceMembersUseCase implements IGetWorkspaceMembersUseCase {
  constructor(
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _userRepo: IUserRepository,
  ) { }

  async execute(workspaceId: string, search?: string) {
    const memberships = await this._membershipRepo.findByWorkspace(workspaceId);

    const members = await Promise.all(
      memberships.map(async (membership) => {
        try {
          const user = await this._userRepo.findById(membership.userId);
          if (!user) return null;

          return {
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            role: membership.role,
            joinedAt: membership.joinedAt,
            profileImage: user.profileImage,
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error fetching user ${membership.userId}:`, error);
          return null;
        }
      }),
    );

    let validMembers = members.filter((m): m is NonNullable<typeof m> => m !== null);

    if (search) {
      const lowerSearch = search.toLowerCase();
      validMembers = validMembers.filter(m =>
        m.fullName.toLowerCase().includes(lowerSearch) ||
        m.email.toLowerCase().includes(lowerSearch)
      );
    }

    return validMembers;
  }
}
