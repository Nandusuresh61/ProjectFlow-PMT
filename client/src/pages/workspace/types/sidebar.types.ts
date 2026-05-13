export type SidebarMode = 'workspace' | 'project';

export interface Project {
    id: string;
    name: string;
    color: string;
    key: string;
    description: string | null;
    workspaceId: string;
    createdBy: string;
    memberIds: string[];
    status: 'ACTIVE' | 'ARCHIVED';
    createdAt: string;
    updatedAt: string;
}

export type WorkspaceTab =
    | 'dashboard'
    | 'team'
    | 'chat'
    | 'meetings'
    | 'settings';

export type ProjectTab =
    | 'overview'
    | 'backlogs'
    | 'board'
    | 'sprint'
    | 'project-team';
