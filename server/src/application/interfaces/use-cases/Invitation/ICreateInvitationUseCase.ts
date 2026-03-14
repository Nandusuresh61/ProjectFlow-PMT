import { CreateInvitationDto } from "@/application/dtos/InvitationDto";

export interface ICreateInvitationUseCase {
  execute(dto: CreateInvitationDto): Promise<void>;
}