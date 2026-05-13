export interface CreateSprintDto {
  projectId: string;
  name: string;
  goal?: string;
}

export interface AssignIssueToSprintDto {
  issueId: string;
  sprintId: string | null;
}

export interface StartSprintDto {
  sprintId: string;
  startDate: Date;
  endDate: Date;
}

export interface CompleteSprintDto {
  sprintId: string;
  moveToSprintId?: string | null;
}
