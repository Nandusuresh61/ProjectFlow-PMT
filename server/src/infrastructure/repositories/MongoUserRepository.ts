import { UserModel, UserDoc } from "../database/models/MongoUserModel";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { UserQueryOptions, PaginatedUsersResult } from "@/application/dtos/UserDtos";
import { User } from "@/domain/entities/User";
import { AuthProvider } from "@/domain/entities/auth/authProvider";
import { MongoBaseRepository } from "./MongoBaseRepository";

export class MongoUserRepository extends MongoBaseRepository<User, UserDoc> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  protected mapToEntity(doc: UserDoc): User {
    return {
      userId: doc.userId,
      fullName: doc.fullName,
      email: doc.email,
      passwordHash: doc.passwordHash,
      authProvider: doc.authProvider as AuthProvider,
      providerId: doc.providerId,
      isOnboarded: doc.isOnboarded,
      currentWorkspaceId: doc.currentWorkspaceId,
      isSuperAdmin: doc.isSuperAdmin,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.findOne({ userId: id });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async createUser(user: User): Promise<User> {
    const userDoc = {
      ...user,
      authProvider: user.authProvider as string,
    };
    return this.create(userDoc);
  }

  async updatePasswordByEmail(
    email: string,
    passwordHash: string,
  ): Promise<void> {
    await this.updateOne(
      { email },
      {
        $set: {
          passwordHash: passwordHash,
          updatedAt: new Date(),
        },
      },
    );
  }

  async update(user: User): Promise<void> {
    await this.updateOne(
      { userId: user.userId },
      {
        fullName: user.fullName,
        email: user.email,
        passwordHash: user.passwordHash,
        authProvider: user.authProvider as string,
        providerId: user.providerId,
        isOnboarded: user.isOnboarded,
        currentWorkspaceId: user.currentWorkspaceId,
        isSuperAdmin: user.isSuperAdmin,
        updatedAt: new Date(),
      }
    );
  }

  async getAllUsersWithWorkspaces(options: UserQueryOptions): Promise<PaginatedUsersResult> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const matchStage: any = {};
    if (search) {
      matchStage.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortStage: any = {};
    sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const result = await this.model.aggregate([
      { $match: matchStage },
      { $sort: sortStage },
      {
        $facet: {
          users: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "memberships",
                localField: "userId",
                foreignField: "userId",
                as: "memberships",
              },
            },
            {
              $lookup: {
                from: "workspaces",
                localField: "memberships.workspaceId",
                foreignField: "workspaceId",
                as: "workspacesData",
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const users = result[0].users.map((user: any) => ({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      workspaces: user.memberships.map((membership: any) => {
        const workspace = user.workspacesData.find(
          (o: any) => o.workspaceId === membership.workspaceId,
        );

        return {
          workspaceId: membership.workspaceId,
          name: workspace?.name || "Unknown",
          role: membership.role,
        };
      }),
    }));

    const total = result[0].total[0]?.count || 0;

    return {
      users,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}
