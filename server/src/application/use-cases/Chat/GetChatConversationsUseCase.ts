import { IMessageRepository } from "@/application/interfaces/repositories/IMessageRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { Message } from "@/domain/entities/Message";

export interface ChatConversation {
  id: string;
  name: string;
  type: "workspace" | "project";
  lastMessage?: Message;
}

export interface IGetChatConversationsUseCase {
  execute(workspaceId: string, userId: string): Promise<ChatConversation[]>;
}

export class GetChatConversationsUseCase implements IGetChatConversationsUseCase {
  constructor(
    private readonly _messageRepo: IMessageRepository,
    private readonly _projectRepo: IProjectRepository,
    private readonly _workspaceRepo: IWorkspaceRepository
  ) {}

  async execute(workspaceId: string, userId: string): Promise<ChatConversation[]> {
    // 1. Get workspace details
    const workspace = await this._workspaceRepo.findById(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    // 2. Get user's projects in this workspace
    const projects = await this._projectRepo.findByWorkspaceIdAndMemberId(workspaceId, userId);

    // 3. Prepare room IDs
    const conversations: ChatConversation[] = [
      {
        id: workspaceId,
        name: `${workspace.name} (General)`,
        type: "workspace",
      },
      ...projects.map((p) => ({
        id: p.projectId,
        name: p.name,
        type: "project" as const,
      })),
    ];

    const roomIds = conversations.map((c) => c.id);

    // 4. Get last messages for all rooms
    const lastMessages = await this._messageRepo.getLastMessagesForRooms(roomIds);
    
    // 5. Map last messages back to conversations
    const messageMap = new Map(lastMessages.map((m) => [m.roomId, m]));
    
    const enrichedConversations = conversations.map((conv) => ({
      ...conv,
      lastMessage: messageMap.get(conv.id),
    }));

    // 6. Sort by last message date (descending)
    return enrichedConversations.sort((a, b) => {
      const dateA = a.lastMessage?.createdAt.getTime() || 0;
      const dateB = b.lastMessage?.createdAt.getTime() || 0;
      return dateB - dateA;
    });
  }
}
