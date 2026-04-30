import { UserModel, UserDoc } from "../database/models/MongoUserModel";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import {
  UserQueryOptions,
  PaginatedUsersResult,
  UserDetailsDto,
} from "@/application/dtos/UserDtos";
import { User } from "@/domain/entities/User";

import { MongoBaseRepository } from "./MongoBaseRepository";
import { AuthProvider } from "@/shared/enums/AuthProviders";

export class MongoUserRepository
  extends MongoBaseRepository<User, UserDoc>
  implements IUserRepository {
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
      currentWorkspaceId: doc.currentWorkspaceId,
      isSuperAdmin: doc.isSuperAdmin,
      isBlocked: doc.isBlocked,
      profileImage: doc.profileImage || null,
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

  async findByIds(ids: string[]): Promise<User[]> {
    return this.find({ userId: { $in: ids } });
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
        currentWorkspaceId: user.currentWorkspaceId,
        isSuperAdmin: user.isSuperAdmin,
        isBlocked: user.isBlocked,
        profileImage: user.profileImage,
        updatedAt: new Date(),
      },
    );
  }

  async getAllUsersWithWorkspaces(
    options: UserQueryOptions,
  ): Promise<PaginatedUsersResult> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;
    const skip = (page - 1) * limit;

    const matchStage: Record<string, any> = {};
    if (search) {
      matchStage.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sortStage: Record<string, 1 | -1> = {};
    sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;

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

    const users = result[0].users.map((user: UserDoc & { memberships: { workspaceId: string, role: string }[], workspacesData: { workspaceId: string, name: string }[] }) => ({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      isBlocked: user.isBlocked,
      isSuperAdmin: user.isSuperAdmin,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      workspaces: user.memberships.map((membership: { workspaceId: string, role: string }) => {
        const workspace = user.workspacesData.find(
          (o: { workspaceId: string, name: string }) => o.workspaceId === membership.workspaceId,
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
  async getUserDetails(userId: string): Promise<UserDetailsDto | null> {
    const result = await this.model.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "memberships",
          localField: "userId",
          foreignField: "userId",
          as: "memberships",
        },
      },
      { $unwind: "$memberships" },
      {
        $lookup: {
          from: "workspaces",
          localField: "memberships.workspaceId",
          foreignField: "workspaceId",
          as: "workspace",
        },
      },
      { $unwind: "$workspace" },
      {
        $lookup: {
          from: "plans",
          localField: "workspace.planId",
          foreignField: "planId",
          as: "plan",
        },
      },
      {
        $unwind: {
          path: "$plan",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "workspace.ownerId",
          foreignField: "userId",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "memberships",
          localField: "workspace.workspaceId",
          foreignField: "workspaceId",
          pipeline: [{ $count: "count" }],
          as: "memberCount",
        },
      },
      {
        $addFields: {
          memberCount: {
            $ifNull: [{ $arrayElemAt: ["$memberCount.count", 0] }, 0],
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          userId: { $first: "$userId" },
          fullName: { $first: "$fullName" },
          email: { $first: "$email" },
          isBlocked: { $first: "$isBlocked" },
          isSuperAdmin: { $first: "$isSuperAdmin" },
          profileImage: { $first: "$profileImage" },
          createdAt: { $first: "$createdAt" },
          workspaces: {
            $push: {
              workspaceId: "$workspace.workspaceId",
              name: "$workspace.name",
              role: "$memberships.role",
              planName: { $ifNull: ["$plan.name", "Unknown"] },
              ownerName: { $ifNull: ["$owner.fullName", "Unknown"] },
              memberCount: "$memberCount",
            },
          },
        },
      },
    ]);

    if (!result || result.length === 0) {
      // If user has no workspaces, they won't appear in the aggregation because of $unwind "$memberships"
      // Fallback: fetch user basic details
      const user = await this.model.findOne({ userId });
      if (!user) return null;

      return {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        isBlocked: user.isBlocked,
        isSuperAdmin: user.isSuperAdmin,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        workspaces: [],
      };
    }

    return result[0];
  }
  async updateCurrentWorkspace(
    userId: string,
    currentWorkspaceId: string,
  ): Promise<void> {
    await UserModel.updateOne({ userId }, { $set: { currentWorkspaceId } });
  }
}
