import { SendEmailDto } from "@/application/dtos/SendEmailDto";

export interface IEmailService {
    sendMail(data: SendEmailDto):Promise<void>;
}