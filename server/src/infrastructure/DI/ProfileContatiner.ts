import { ProfileController } from "@/presentation/controllers/ProfileController";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { GetUserProfileUseCase } from "@/application/use-cases/User/GetUserProfileUseCase";
import { UpdatUserProfileUseCase } from "@/application/use-cases/User/UpdateUserProfileUseCase";

const userRepo = new MongoUserRepository();
const getUserProfileUseCase = new GetUserProfileUseCase(userRepo);
const updatUserProfileUseCase = new UpdatUserProfileUseCase(userRepo);

export const profileConroller = new ProfileController(
  getUserProfileUseCase,
  updatUserProfileUseCase
);

