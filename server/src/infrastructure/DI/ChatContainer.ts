import { MongoMessageRepository } from "@/infrastructure/repositories/MongoMessageRepository";
import { UidService } from "@/infrastructure/services/UidService";
import { SendMessageUseCase } from "@/application/use-cases/Chat/SendMessageUseCase";
import { GetChatMessagesUseCase } from "@/application/use-cases/Chat/GetChatMessagesUseCase";
import { CheckChatAccessUseCase } from "@/application/use-cases/Chat/CheckChatAccessUseCase";
import { GetChatConversationsUseCase } from "@/application/use-cases/Chat/GetChatConversationsUseCase";
import { ChatController } from "@/presentation/controllers/ChatController";
import { MembershipRepository } from "@/infrastructure/repositories/MongoMembershipRepository";
import { MongoProjectRepository } from "@/infrastructure/repositories/MongoProjectRepository";
import { WorkspaceRepository } from "@/infrastructure/repositories/MongoWorkspaceRepository";

const messageRepository = new MongoMessageRepository();
const uidService = new UidService();
const membershipRepository = new MembershipRepository();
const projectRepository = new MongoProjectRepository();
const workspaceRepository = new WorkspaceRepository();

const sendMessageUseCase = new SendMessageUseCase(messageRepository, uidService);
const getChatMessagesUseCase = new GetChatMessagesUseCase(messageRepository);
const getChatConversationsUseCase = new GetChatConversationsUseCase(
  messageRepository,
  projectRepository,
  workspaceRepository
);
const checkChatAccessUseCase = new CheckChatAccessUseCase(
  membershipRepository,
  projectRepository,
  workspaceRepository
);

export const chatController = new ChatController(
  getChatMessagesUseCase,
  getChatConversationsUseCase
);
export { sendMessageUseCase, getChatMessagesUseCase, checkChatAccessUseCase, getChatConversationsUseCase };
