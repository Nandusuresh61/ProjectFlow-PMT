import { ProfileController } from "@/presentation/controllers/ProfileController";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { GetUserProfileUseCase } from "@/application/use-cases/User/GetUserProfileUseCase";

const userRepo = new MongoUserRepository();
const getUserProfileUseCase = new GetUserProfileUseCase(userRepo);

export const profileConroller = new ProfileController(getUserProfileUseCase);

