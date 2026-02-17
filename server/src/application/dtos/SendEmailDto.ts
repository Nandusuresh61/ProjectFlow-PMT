import { EmailType } from "shared";

export interface SendEmailDto {
  to: string;
  subject: string;
  body: string;
  type: EmailType;
}
