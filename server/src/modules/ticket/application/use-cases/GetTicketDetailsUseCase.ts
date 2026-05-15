import { IGetTicketDetailsUseCase, TicketDetailsResponse } from "./IGetTicketDetailsUseCase";
import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { ITicketMessageRepository } from "../../domain/repositories/ITicketMessageRepository";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";

export class GetTicketDetailsUseCase implements IGetTicketDetailsUseCase {
  constructor(
    private readonly _ticketRepository: ITicketRepository,
    private readonly _ticketMessageRepository: ITicketMessageRepository,
    private readonly _membershipRepository: IMembershipRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(ticketId: string, userId: string, isSuperAdmin: boolean): Promise<TicketDetailsResponse> {
    const ticket = await this._ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Ticket not found", HttpStatusCode.NOT_FOUND);
    }

    if (!isSuperAdmin) {
        // Check if user belongs to the workspace
        const membership = await this._membershipRepository.findByUserAndWorkspace(userId, ticket.workspaceId);
        if (!membership) {
             throw new AppError(ErrorCode.AUTH, "Unauthorized access to this ticket", HttpStatusCode.FORBIDDEN);
        }
    }

    const messages = await this._ticketMessageRepository.findByTicketId(ticketId);

    // Fetch sender names
    const senderIds = Array.from(new Set(messages.map(m => m.senderId)));
    const users = await this._userRepository.findByIds(senderIds);
    const userMap = new Map(users.map(u => [u.userId, u.fullName]));

    const messagesWithSender = messages.map(msg => ({
        ...msg,
        senderName: userMap.get(msg.senderId) || "Unknown User"
    }));

    return {
      ticket,
      messages: messagesWithSender,
    };
  }
}
