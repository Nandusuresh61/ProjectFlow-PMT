import { IOtpGenerator } from "@/application/interfaces/services/IOtpGenerator";

export class OtpGenerator implements IOtpGenerator {
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
