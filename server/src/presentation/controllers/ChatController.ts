import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { IGetChatMessagesUseCase } from "@/application/use-cases/Chat/GetChatMessagesUseCase";
import { IGetChatConversationsUseCase } from "@/application/use-cases/Chat/GetChatConversationsUseCase";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class ChatController {
  constructor(
    private readonly _getChatMessagesUseCase: IGetChatMessagesUseCase,
    private readonly _getChatConversationsUseCase: IGetChatConversationsUseCase
  ) {}

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      const { limit, skip } = req.query;
      
      const messages = await this._getChatMessagesUseCase.execute(
        roomId,
        limit ? parseInt(limit as string) : 50,
        skip ? parseInt(skip as string) : 0
      );

      res.status(HttpStatusCode.OK).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  async getConversations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const conversations = await this._getChatConversationsUseCase.execute(workspaceId, userId);

      res.status(HttpStatusCode.OK).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }
}
