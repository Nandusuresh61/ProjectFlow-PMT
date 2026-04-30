import { AppMessages } from "@/shared/messages/AppMessages";
import { EmailType } from "@/shared/enums/EmailEnums";

export class EmailTemplates {
  private static readonly primaryColor = "#4F46E5";
  private static readonly backgroundColor = "#F9FAFB";
  private static readonly textColor = "#1F2937";

  private static baseLayout(content: string): string {
    return `
      <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: ${this.backgroundColor}; padding: 40px 20px; color: ${this.textColor}; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${this.primaryColor}; padding: 32px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">ProjectFlow</h1>
          </div>
          <div style="padding: 48px 40px;">
            ${content}
          </div>
          <div style="padding: 32px 40px; background-color: #F8FAFC; text-align: center; font-size: 14px; color: #64748B; border-top: 1px solid #E2E8F0;">
            <p style="margin: 0; font-weight: 500;">&copy; ${new Date().getFullYear()} ProjectFlow Inc.</p>
            <p style="margin: 8px 0 0;">Efficient Project Management, Simplified.</p>
          </div>
        </div>
      </div>
    `;
  }

  static getOtpTemplate(otp: string, fullName: string = "there") {
    const subject = AppMessages.EMAIL_SUBJECT_OTP;
    const body = this.baseLayout(`
      <h2 style="margin-top: 0; color: ${this.textColor}; font-size: 24px; font-weight: 700;">Verify your email</h2>
      <p style="font-size: 16px; color: #4B5563;">Hello ${fullName},</p>
      <p style="font-size: 16px; color: #4B5563;">Your verification code is below. Enter this code to complete your registration. This code is valid for 5 minutes.</p>
      <div style="margin: 40px 0; padding: 32px; background-color: #F1F5F9; border-radius: 12px; text-align: center;">
        <span style="font-family: 'Courier New', monospace; font-size: 42px; font-weight: 800; letter-spacing: 12px; color: ${this.primaryColor};">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #94A3B8; margin-top: 32px;">If you didn't request this code, you can safely ignore this email.</p>
    `);
    return { subject, body };
  }

  static getResetPasswordTemplate(otp: string) {
    const subject = AppMessages.EMAIL_SUBJECT_RESET_PASSWORD;
    const body = this.baseLayout(`
      <h2 style="margin-top: 0; color: ${this.textColor}; font-size: 24px; font-weight: 700;">Reset your password</h2>
      <p style="font-size: 16px; color: #4B5563;">You requested a password reset. Use the code below to proceed with your request. This code will expire in 5 minutes.</p>
      <div style="margin: 40px 0; padding: 32px; background-color: #F1F5F9; border-radius: 12px; text-align: center;">
        <span style="font-family: 'Courier New', monospace; font-size: 42px; font-weight: 800; letter-spacing: 12px; color: ${this.primaryColor};">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #94A3B8; margin-top: 32px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
    `);
    return { subject, body };
  }

  static getInviteTemplate(inviteLink: string) {
    const subject = AppMessages.EMAIL_SUBJECT_INVITE_USER;
    const body = this.baseLayout(`
      <h2 style="margin-top: 0; color: ${this.textColor}; font-size: 24px; font-weight: 700;">You're Invited!</h2>
      <p style="font-size: 16px; color: #4B5563;">You've been invited to join a workspace on ProjectFlow. Click the button below to accept the invitation and start collaborating with your team.</p>
      <div style="margin: 40px 0; text-align: center;">
        <a href="${inviteLink}" 
           style="display: inline-block; padding: 16px 40px; background-color: ${this.primaryColor}; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
          Accept Invitation
        </a>
      </div>
      <p style="font-size: 14px; color: #64748B;">Alternatively, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; font-size: 14px; color: ${this.primaryColor}; font-family: monospace; background: #F8FAFC; padding: 12px; border-radius: 6px; border: 1px solid #E2E8F0;">${inviteLink}</p>
      <p style="font-size: 14px; color: #94A3B8; margin-top: 32px;">This invitation will expire in 24 hours.</p>
    `);
    return { subject, body };
  }

  static getTemplate(type: EmailType, data: { otp?: string; fullName?: string; inviteLink?: string }) {
    switch (type) {
      case EmailType.OTP:
        return this.getOtpTemplate(data.otp!, data.fullName);
      case EmailType.RESET_PASSWORD:
        return this.getResetPasswordTemplate(data.otp!);
      case EmailType.INVITE_USER:
        return this.getInviteTemplate(data.inviteLink!);
      default:
        throw new Error(`Email template not found for type: ${type}`);
    }
  }
}
