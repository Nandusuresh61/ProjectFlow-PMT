import { GetMeResponseDto } from "@/application/dtos/UserDtos";

export interface IGetMeUseCase {
  execute(userId: string): Promise<GetMeResponseDto>;
}
