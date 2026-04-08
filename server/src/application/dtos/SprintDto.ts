export interface CreateSprintDto {
    projectId: string,
    name: string;
    goal?:string;  
}

export interface AssignIssueToSprintDto {
    issueId: string;
    sprintId: string | null;
}


