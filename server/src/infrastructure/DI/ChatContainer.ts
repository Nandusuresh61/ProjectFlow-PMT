import { MessageRepository } from "@/infrastructure/repositories/MessageRepository";
import { UidService } from "@/infrastructure/services/UidService";
import { SendMessageUseCase } from "@/application/use-cases/Chat/SendMessageUseCase";
import { GetChatMessagesUseCase } from "@/application/use-cases/Chat/GetChatMessagesUseCase";
import { CheckChatAccessUseCase } from "@/application/use-cases/Chat/CheckChatAccessUseCase";
import { GetChatConversationsUseCase } from "@/application/use-cases/Chat/GetChatConversationsUseCase";
import { ChatController } from "@/presentation/controllers/ChatController";
import { MembershipRepository } from "@/infrastructure/repositories/MembershipRepository";
import { ProjectRepository } from "@/infrastructure/repositories/ProjectRepository";
import { WorkspaceRepository } from "@/infrastructure/repositories/WorkspaceRepository";

const messageRepository = new MessageRepository();
const uidService = new UidService();
const membershipRepository = new MembershipRepository();
const projectRepository = new ProjectRepository();
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
