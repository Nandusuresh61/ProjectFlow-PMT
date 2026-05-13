

export interface InvitationDetailsDto {
  email: string;
  isRegistered: boolean;
  workspaceId: string;
  role: string;
}

export interface IGetInvitationDetailsUseCase {
  execute(token: string): Promise<InvitationDetailsDto>;
}
