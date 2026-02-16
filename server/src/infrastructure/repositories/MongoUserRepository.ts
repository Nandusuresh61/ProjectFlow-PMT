import { UserModel, UserDoc } from "../database/models/MongoUserModel";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { User } from "@/domain/entities/User";
import { AuthProvider } from "@/domain/entities/auth/authProvider";

export class MongoUserRepository implements IUserRepository {
  private toEntity(doc: UserDoc): User {
    return {
      userId: doc.userId,
      fullName: doc.fullName,
      email: doc.email,
      passwordHash: doc.passwordHash,
      authProvider: doc.authProvider as AuthProvider,
      providerId: doc.providerId,
      isOnboarded: doc.isOnboarded,
      currentOrganizationId: doc.currentOrganizationId,
      isSuperAdmin: doc.isSuperAdmin,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findById(id: string): Promise<User> {
    const user = await UserModel.findOne({ userId: id });
    if (!user) {
      throw new Error("User not found");
    }
    return this.toEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? this.toEntity(user) : null;
  }

  async createUser(user: User): Promise<User> {
    const userDoc = {
      ...user,
      authProvider: user.authProvider as string,
    };
    const newUser = await UserModel.create(userDoc);
    return this.toEntity(newUser);
  }

  async updatePasswordByEmail(
    email: string,
    passwordHash: string,
  ): Promise<void> {
    await UserModel.updateOne(
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
    await UserModel.updateOne(
      { userId: user.userId },
      {
        fullName: user.fullName,
        email: user.email,
        passwordHash: user.passwordHash,
        authProvider: user.authProvider as string,
        providerId: user.providerId,
        isOnboarded: user.isOnboarded,
        currentOrganizationId: user.currentOrganizationId,
        isSuperAdmin: user.isSuperAdmin,
        updatedAt: new Date(),
      },
    );
  }
  async getAllUsersWithOrganizations(): Promise<any[]> {
    const users = await UserModel.aggregate([
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
          from: "organizations",
          localField: "memberships.organizationId",
          foreignField: "organizationId",
          as: "organizationsData",
        },
      },
    ]);

    return users.map((user: any) => ({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      organizations: user.memberships.map((membership: any) => {
        const org = user.organizationsData.find(
          (o: any) => o.organizationId === membership.organizationId,
        );

        return {
          organizationId: membership.organizationId,
          name: org?.name || "Unknown",
          role: membership.role,
        };
      }),
    }));
  }
}
