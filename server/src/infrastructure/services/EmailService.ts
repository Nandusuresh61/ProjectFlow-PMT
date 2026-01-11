import { SendEmailDto } from "@/application/dtos/SendEmailDto";
import { IEmailService } from "@/application/interfaces/services/IEmailService";
import { AppError, EmailMessages, ErrorCode, HttpStatusCode } from "shared";
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
    } catch (error) {
      throw new AppError(
          ErrorCode.EMAIL_SEND_FAILED,
          EmailMessages.EMAIL_SENT_FAILED,
          HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
