import { UserAuthResponseDto } from "@/application/dtos/UserDtos";

export class AuthResponseMapper {
  static toUserResponse(data: UserAuthResponseDto) {
    return {
      user: {
        userId: data.user.userId,
        fullName: data.user.fullName,
        email: data.user.email,
        isSuperAdmin: data.user.isSuperAdmin,
        isBlocked: data.user.isBlocked,
        currentWorkspaceId: data.user.currentWorkspaceId,
        membershipCount: data.user.membershipCount,
        profileImage: data.user.profileImage,
      },
    };
  }
}
