import { API } from "@/services/api";
import { API_ROUTES } from "@/constants/api.constants";

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

export interface DashboardStat {
    label: string;
    value: string;
    sub: string;
}

export interface DashboardActivity {
    id: string;
    user: string;
    name: string;
    action: string;
    obj: string;
    time: string;
    type: string;
}

export interface DashboardData {
    stats: DashboardStat[];
    activities: DashboardActivity[];
}

export const getUserWorkspaces = async (): Promise<WorkspaceResponse<WorkspaceData[]>> => {
    const { data } = await API.get<WorkspaceResponse<WorkspaceData[]>>(API_ROUTES.WORKSPACE.USER_WORKSPACES);
    return data;
};

export const switchWorkspace = async (workspaceId: string): Promise<WorkspaceResponse> => {
    const { data } = await API.put<WorkspaceResponse>(API_ROUTES.WORKSPACE.SWITCH(workspaceId));
    return data;
};

export const createWorkspace = async (payload: { workspaceName: string, planId?: string }): Promise<WorkspaceResponse<{ workspaceId: string }>> => {
    const { data } = await API.post<WorkspaceResponse<{ workspaceId: string }>>(API_ROUTES.WORKSPACE.CREATE, payload);
    return data;
};

export const checkWorkspaceName = async (name: string): Promise<WorkspaceResponse<{ isAvailable: boolean }>> => {
    const { data } = await API.get<WorkspaceResponse<{ isAvailable: boolean }>>(`${API_ROUTES.WORKSPACE.CHECK_NAME}?name=${encodeURIComponent(name)}`);
    return data;
};

export const getDashboardData = async (workspaceId: string): Promise<WorkspaceResponse<DashboardData>> => {
    const { data } = await API.get<WorkspaceResponse<DashboardData>>(API_ROUTES.WORKSPACE.DASHBOARD(workspaceId));
    return data;
};
