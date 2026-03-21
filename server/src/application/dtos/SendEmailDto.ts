import { EmailType } from "@/shared/enums/EmailEnums";

export interface SendEmailDto {
  to: string;
  subject: string;
  body: string;
  type: EmailType;
}
