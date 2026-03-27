import { ProfileController } from "@/presentation/controllers/ProfileController";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { GetUserProfileUseCase } from "@/application/use-cases/User/GetUserProfileUseCase";
import { UpdatUserProfileUseCase } from "@/application/use-cases/User/UpdateUserProfileUseCase";
import { ChangePasswordUseCase } from "@/application/use-cases/User/ChangePasswordUseCase";
import { PasswordHash } from "../services/PasswordHash";

const userRepo = new MongoUserRepository();
const passwordHash = new PasswordHash();
const getUserProfileUseCase = new GetUserProfileUseCase(userRepo);
const updatUserProfileUseCase = new UpdatUserProfileUseCase(userRepo);
const changePasswordUseCase = new ChangePasswordUseCase(userRepo, passwordHash);

export const profileController = new ProfileController(
  getUserProfileUseCase,
  updatUserProfileUseCase,
  changePasswordUseCase,
);
