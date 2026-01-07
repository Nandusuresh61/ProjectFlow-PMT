import { RegisterUserUseCase } from "@/application/use-cases/User/RegisterUserUseCase";
import { PasswordHash } from "@/infrastructure/services/PasswordHash";
import { MongoUserRepostory } from "@/infrastructure/repositories/MongoUserRepository";
import { TokenService } from "@/infrastructure/services/TokenService";
import { UidService } from "@/infrastructure/services/UidService";
import { AuthController } from "../controllers/AuthController";

/**
 * Infrastructure layer use case
 */

const userRepository = new MongoUserRepostory();
const passwordHasher = new PasswordHash();
const tokenService = new TokenService();
const uidService = new UidService();

/**
 * Application layer useCase
 */


const registerUserUseCase = new RegisterUserUseCase(
    userRepository,
    uidService,
    passwordHasher,
    tokenService,
);


export const authController = new AuthController(registerUserUseCase);