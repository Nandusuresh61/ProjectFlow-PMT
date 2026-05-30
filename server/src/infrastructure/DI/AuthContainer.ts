import { RegisterUserUseCase } from "@/application/use-cases/User/RegisterUserUseCase";
import { PasswordHash } from "@/infrastructure/services/PasswordHash";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { TokenService } from "@/infrastructure/services/TokenService";
import { UidService } from "@/infrastructure/services/UidService";
import { AuthController } from "@/presentation/controllers/AuthController";
import { StartRegistrationUseCase } from "@/application/use-cases/User/StartRegistrationUseCase";
import { VerifyOtpUseCase } from "@/application/use-cases/User/VerifyOtpUseCase";
import { OtpGenerator } from "@/infrastructure/services/OtpGenerator";
import { RedisOtpStore } from "@/infrastructure/cache/RedisOtpStore";
import { EmailService } from "@/infrastructure/services/EmailService";
import { ResendOtpUseCase } from "@/application/use-cases/User/ResendOtpUseCase";
import { LoginUserUseCase } from "@/application/use-cases/User/LoginUserUseCase";
import { RefreshTokenUseCase } from "@/application/use-cases/User/RefreshTokenUseCase";
import { ForgotPasswordOtpUseCase } from "@/application/use-cases/User/ForgotPasswordOtpUseCase";
import { RedisResetPasswordOtpStore } from "../cache/RedisResetPasswordOtpStore";
import { ResetPasswordUseCase } from "@/application/use-cases/User/ResetPasswordUseCase";
import { GoogleOAuthService } from "../services/GoogleOAuthService";
import { GoogleAuthUseCase } from "@/application/use-cases/User/GoogleAuthUseCase";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { GetMeUseCase } from "@/application/use-cases/User/GetMeUseCase";
import { AuthCookieService } from "../services/AuthCookieService";

/**
 * Infrastructure layer use case
 */

const userRepository = new UserRepository();
const passwordHasher = new PasswordHash();
const tokenService = new TokenService();
const uidService = new UidService();
const otpStore = new RedisOtpStore();
const otpGenerator = new OtpGenerator();
const emailService = new EmailService();
const resetOtpStore = new RedisResetPasswordOtpStore();
const googleOAuthService = new GoogleOAuthService();
const membershipRepository = new MembershipRepository();
const authCookieService = new AuthCookieService();


/**
 * Application layer useCase
 */
const startRegisterUseCase = new StartRegistrationUseCase(
  userRepository,
  passwordHasher,
  otpStore,
  otpGenerator,
  emailService,
);

const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  uidService,
  tokenService,
);

const verifyOtpUseCase = new VerifyOtpUseCase(
  otpStore,
  passwordHasher,
  registerUserUseCase,
);

const resendOtpUseCase = new ResendOtpUseCase(
  userRepository,
  otpStore,
  otpGenerator,
  passwordHasher,
  emailService,
);

const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  tokenService,
  passwordHasher,
  membershipRepository
);

const refreshTokenUseCase = new RefreshTokenUseCase(tokenService);

const resetPasswordOtpUseCase = new ForgotPasswordOtpUseCase(
  userRepository,
  resetOtpStore,
  emailService,
  otpGenerator,
  passwordHasher,
);

const resetPasswordUseCase = new ResetPasswordUseCase(
  userRepository,
  resetOtpStore,
  passwordHasher
);


const googleAuthUseCase = new GoogleAuthUseCase(
  userRepository,
  tokenService,
  uidService,
  membershipRepository
);


const getMeUseCase = new GetMeUseCase(userRepository, membershipRepository);

export const authController = new AuthController(
  startRegisterUseCase,
  verifyOtpUseCase,
  resendOtpUseCase,
  loginUserUseCase,
  refreshTokenUseCase,
  resetPasswordOtpUseCase,
  resetPasswordUseCase,
  googleOAuthService,
  googleAuthUseCase,
  getMeUseCase,
  authCookieService
);
