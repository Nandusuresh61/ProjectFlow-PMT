import { SendEmailDto } from "@/application/dtos/SendEmailDto";
import { IEmailService } from "@/application/interfaces/services/IEmailService";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { emailTransporter } from "../config/EmailConfig";

export class EmailService implements IEmailService {
  async sendMail(data: SendEmailDto): Promise<void> {
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.to,
        subject: data.subject,
        html: data.body,
      });
    } catch {
      throw new AppError(
          ErrorCode.EMAIL_SEND_FAILED,
          AppMessages.EMAIL_SENT_FAILED,
          HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
