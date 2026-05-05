import { IGetWorkspaceDashboardDataUseCase, DashboardData, DashboardStat, DashboardActivity } from "@/application/interfaces/use-cases/workspace/IGetWorkspaceDashboardDataUseCase";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { Issue } from "@/domain/entities/Issue";

export class GetWorkspaceDashboardDataUseCase implements IGetWorkspaceDashboardDataUseCase {
    constructor(
        private readonly _projectRepo: IProjectRepository,
        private readonly _issueRepo: IIssueRepository,
        private readonly _membershipRepo: IMembershipRepository
    ) {}

    async execute(workspaceId: string, userId: string, role: WorkspaceRoleEnum): Promise<DashboardData> {
        const isAdmin = role === WorkspaceRoleEnum.WORKSPACE_OWNER || role === WorkspaceRoleEnum.WORKSPACE_ADMIN;

        let projectsCount: number;
        let issuesCount: number;
        let recentIssues: Issue[];

        if (isAdmin) {
            projectsCount = await this._projectRepo.countByWorkspaceId(workspaceId);
            issuesCount = await this._issueRepo.countByWorkspaceId(workspaceId);
            recentIssues = await this._issueRepo.findRecentByWorkspaceId(workspaceId, 5);
        } else {
            const userProjects = await this._projectRepo.findByWorkspaceIdAndMemberId(workspaceId, userId);
            projectsCount = userProjects.length;
            issuesCount = await this._issueRepo.countByWorkspaceIdAndAssignee(workspaceId, userId);
            recentIssues = await this._issueRepo.findRecentByWorkspaceIdAndAssignee(workspaceId, userId, 5);
        }

        const membersCount = await this._membershipRepo.countByWorkspace(workspaceId);

        const stats: DashboardStat[] = [
            { label: 'Active Projects', value: projectsCount.toString(), sub: isAdmin ? 'Across workspace' : 'Projects you are in' },
            { label: 'Open Issues', value: issuesCount.toString(), sub: isAdmin ? 'Across workspace' : 'Assigned to you' },
            { label: 'Team Members', value: membersCount.toString(), sub: 'In this workspace' },
            { label: 'Sprint Progress', value: '0%', sub: 'Coming soon' }, // Sprint progress logic can be added later
        ];

        const activities: DashboardActivity[] = recentIssues.map(issue => ({
            id: issue.issueId,
            user: '??', // We don't have easy access to the user name here without another lookup
            name: 'User', 
            action: issue.status === 'DONE' ? 'Completed' : 'Updated',
            obj: issue.issueKey,
            time: this._getTimeAgo(issue.updatedAt),
            type: issue.type
        }));

        return { stats, activities };
    }

    private _getTimeAgo(date: Date): string {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " min ago";
        return Math.floor(seconds) + " seconds ago";
    }
}
