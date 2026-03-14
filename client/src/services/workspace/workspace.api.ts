import { API } from "@/services/api";

export interface WorkspaceData {
    workspaceId: string;
    name: string;
    ownerId: string;
    planId: string;
    createdAt: string;
    updatedAt: string;
}

export interface WorkspaceResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export const getUserWorkspaces = async (): Promise<WorkspaceResponse<WorkspaceData[]>> => {
    const { data } = await API.get<WorkspaceResponse<WorkspaceData[]>>("/workspace/user/workspaces");
    return data;
};

export const switchWorkspace = async (workspaceId: string): Promise<WorkspaceResponse> => {
    const { data } = await API.put<WorkspaceResponse>(`/workspace/${workspaceId}/switch`);
    return data;
};

export const createWorkspace = async (payload: { workspaceName: string, planId?: string }): Promise<WorkspaceResponse<{ workspaceId: string }>> => {
    const { data } = await API.post<WorkspaceResponse<{ workspaceId: string }>>("/workspace/create", payload);
    return data;
};
