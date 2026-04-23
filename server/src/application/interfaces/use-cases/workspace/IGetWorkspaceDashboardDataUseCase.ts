import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

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

export interface IGetWorkspaceDashboardDataUseCase {
    execute(workspaceId: string, userId: string, role: WorkspaceRoleEnum): Promise<DashboardData>;
}
