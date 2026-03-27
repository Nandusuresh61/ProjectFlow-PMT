export type SidebarMode = 'workspace' | 'project';

export interface Project {
    id: string;
    name: string;
    color: string;
    key: string; // e.g. "PF", "MS"
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
    | 'sprint-performance'
    | 'project-team';
