import { Request, Response, NextFunction } from "express";
import { IGetChatMessagesUseCase } from "@/application/use-cases/Chat/GetChatMessagesUseCase";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class ChatController {
  constructor(private readonly _getChatMessagesUseCase: IGetChatMessagesUseCase) {}

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
}
