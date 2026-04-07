export interface CreateSprintDto {
    projectId: string,
    name: string;
    goal?:string;  
}



export interface AddIssueToSprintDto {
  sprintId: string;
  issueId: string;
}
