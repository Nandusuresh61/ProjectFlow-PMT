import { CreateMeetingDTO, MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";

export interface ICreateMeetingUseCase {
  execute(dto: CreateMeetingDTO): Promise<MeetingResponseDTO>;
}
