import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getRoleLabel(role: WorkspaceRoleEnum | string): string {
    const roleLabels: Record<string, string> = {
        [WorkspaceRoleEnum.WORKSPACE_OWNER]: "Owner",
        [WorkspaceRoleEnum.WORKSPACE_ADMIN]: "Admin",
        [WorkspaceRoleEnum.WORKSPACE_MEMBER]: "Member",
        [WorkspaceRoleEnum.WORKSPACE_VIEWER]: "Viewer",
    }

    return roleLabels[role] || role
}
