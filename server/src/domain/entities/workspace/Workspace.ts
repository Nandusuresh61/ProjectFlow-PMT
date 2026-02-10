export interface Workspace {
  workspaceId: string;
  name: string;
  ownerId: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  workspaceMemberId: string;
  workspaceId: string;
  userId: string;
  role: "Owner" | "Admin" | "Member";
  joinedAt: Date;
}

export interface PendingInvite {
  pendingInviteId: string;
  workspaceId: string;
  invitedEmail: string;
  role: "Admin" | "Member";
  invitedBy: string;
  createdAt: Date;
}
