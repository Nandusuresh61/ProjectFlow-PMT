import { RegisterUserUseCase } from "@/application/use-cases/User/RegisterUserUseCase";
import { PasswordHash } from "@/infrastructure/services/PasswordHash";
import { MongoUserRepostory } from "@/infrastructure/repositories/MongoUserRepository";
import { TokenService } from "@/infrastructure/services/TokenService";
import { UidService } from "@/infrastructure/services/UidService";
import { AuthController } from "../controllers/AuthController";
import { StartRegisterUseCase } from "@/application/use-cases/User/StartRegisterationUseCase";
import { VerifyOtpUseCase } from "@/application/use-cases/User/VerifyOtpUseCase";
import { OtpGenerator } from "@/infrastructure/services/OtpGenerator";
import { RedisOtpStore } from "@/infrastructure/cache/RedisOtpStore";
import { EmailService } from "@/infrastructure/services/EmailService";
import { ResendOtpUseCase } from "@/application/use-cases/User/ResendOtpUseCase";

/**
 * Infrastructure layer use case
 */

const userRepository = new MongoUserRepostory();
const passwordHasher = new PasswordHash();
const tokenService = new TokenService();
const uidService = new UidService();
const otpStore = new RedisOtpStore();
const otpGenerator = new OtpGenerator()
const emailService = new EmailService();

/**
 * Application layer useCase
 */
const startRegisterUseCase = new StartRegisterUseCase(
  userRepository,
  passwordHasher,
  otpStore,
  otpGenerator,
  emailService
);

const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  uidService,
  tokenService
);

const verifyOtpUseCase = new VerifyOtpUseCase(
  otpStore,
  passwordHasher,
  registerUserUseCase
);

const resendOtpUseCase = new ResendOtpUseCase(
  userRepository,
  otpStore,
  otpGenerator,
  passwordHasher,
  emailService
)

export const authController = new AuthController(
  startRegisterUseCase,
  verifyOtpUseCase,
  resendOtpUseCase
);
