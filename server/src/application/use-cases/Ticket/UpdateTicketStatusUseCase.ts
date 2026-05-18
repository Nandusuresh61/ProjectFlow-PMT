import { IUpdateTicketStatusUseCase } from "@/application/interfaces/use-cases/Ticket/IUpdateTicketStatusUseCase";
import { ITicketRepository } from "@/application/interfaces/repositories/ITicketRepository";
import { TicketStatus } from "@/shared/enums/TicketStatus";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class UpdateTicketStatusUseCase implements IUpdateTicketStatusUseCase {
  constructor(private readonly _ticketRepository: ITicketRepository) {}

  async execute(ticketId: string, status: TicketStatus): Promise<void> {
    const ticket = await this._ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Ticket not found", HttpStatusCode.NOT_FOUND);
    }

    let resolvedAt: Date | undefined;
    if (status === TicketStatus.RESOLVED || status === TicketStatus.CLOSED) {
      resolvedAt = new Date();
    }

    await this._ticketRepository.updateStatus(ticketId, status, resolvedAt);
  }
}
