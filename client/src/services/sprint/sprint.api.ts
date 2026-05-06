import { API_ROUTES } from "@/constants/api.constants";
import { API } from "@/services/api";

export interface SprintData {
  sprintId: string;
  projectId: string;
  name: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
  issueIds: string[];
  startDate?: string;
  endDate?: string;
  goal?: string;
  plannedPoints?: number;
  completedPoints?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SprintResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CreateSprintPayload {
  projectId: string;
  name: string;
  goal?: string;
  workspaceId: string;
}

export const createSprint = async (
  payload: CreateSprintPayload
): Promise<SprintResponse<SprintData>> => {
  const { data } = await API.post<SprintResponse<SprintData>>(
    API_ROUTES.SPRINT.BASE,
    payload
  );

  return data;
};

export const getProjectSprints = async (
  projectId: string
): Promise<SprintResponse<SprintData[]>> => {
  const { data } = await API.get<SprintResponse<SprintData[]>>(
    API_ROUTES.SPRINT.LIST_BY_PROJECT(projectId)
  );

  return data;
};

export const assignIssueToSprint = async (
  issueId: string,
  sprintId: string | null
): Promise<SprintResponse<IssueData>> => {
  const { data } = await API.patch<SprintResponse<IssueData>>(
    API_ROUTES.SPRINT.ASSIGN_ISSUE,
    { issueId, sprintId }
  );

  return data;
};

export const startSprint = async (
  sprintId: string,
  startDate: string,
  endDate: string,
  workspaceId: string
): Promise<SprintResponse<SprintData>> => {
  const { data } = await API.patch<SprintResponse<SprintData>>(
    API_ROUTES.SPRINT.START,
    { sprintId, startDate, endDate, workspaceId }
  );

  return data;
};

export interface IssueData {
  issueId: string;
  issueKey: string;
  title: string;
  description: string;
  type: "STORY" | "TASK" | "BUG";
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assigneeId: string | null;
  sprintId: string | null;
  projectId: string;
  workspaceId: string;
  parentId?: string | null;
  storyPoints: number | null;
  sizeLabel?: string | null;
  acceptanceCriteria?: string[];
  attachments?: { name: string; url: string; type: string }[];
  estimatedHours?: number | null;
  remainingHours?: number | null;
  continuedFromIssueId?: string | null;
  continuedIssueId?: string | null;
  taskIds?: string[] | null;
}

export interface ActiveSprintData {
  sprint: SprintData | null;
  issues: IssueData[];
}

export const getActiveSprint = async (
  projectId: string
): Promise<SprintResponse<ActiveSprintData>> => {
  const { data } = await API.get<SprintResponse<ActiveSprintData>>(
    API_ROUTES.SPRINT.GET_ACTIVE(projectId)
  );

  return data;
};

export interface SprintAnalyticsData {
  analyticsId: string | null;
  sprintId: string;
  projectId: string;
  workspaceId: string;
  sprintName: string;
  sprintGoal: string | null;
  startedAt: string;
  completedAt: string | null;
  committedIssues: number;
  completedIssues: number;
  incompleteIssues: number;
  committedStoryPoints: number;
  completedStoryPoints: number;
  spilloverStoryPoints: number;
  committedEstimatedHours: number;
  loggedHours: number;
  remainingHours: number;
  completionRate: number;
  velocity: number;
  scopeChangeCount: number;
  createdAt: string | null;
  isSnapshot: boolean;
}

export interface ProjectVelocityData {
  projectId: string;
  averageVelocity: number;
  sprints: Array<{
    sprintId: string;
    sprintName: string;
    completedAt: string;
    committedStoryPoints: number;
    completedStoryPoints: number;
    velocity: number;
  }>;
}

export interface SprintPerformanceSummaryData {
  projectId: string;
  averageVelocity: number;
  totalSprints: number;
  sprints: SprintAnalyticsData[];
}

export const getSprintAnalytics = async (
  sprintId: string
): Promise<SprintResponse<SprintAnalyticsData>> => {
  const { data } = await API.get<SprintResponse<SprintAnalyticsData>>(
    API_ROUTES.ANALYTICS.SPRINT(sprintId)
  );

  return data;
};

export const getProjectVelocity = async (
  projectId: string
): Promise<SprintResponse<ProjectVelocityData>> => {
  const { data } = await API.get<SprintResponse<ProjectVelocityData>>(
    API_ROUTES.ANALYTICS.PROJECT_VELOCITY(projectId)
  );

  return data;
};

export const getSprintPerformanceSummary = async (
  projectId: string
): Promise<SprintResponse<SprintPerformanceSummaryData>> => {
  const { data } = await API.get<SprintResponse<SprintPerformanceSummaryData>>(
    API_ROUTES.ANALYTICS.PROJECT_SPRINTS(projectId)
  );

  return data;
};

export const completeSprint = async (
  sprintId: string,
  moveToSprintId: string | null,
  workspaceId: string
): Promise<SprintResponse<SprintData>> => {
  const { data } = await API.patch<SprintResponse<SprintData>>(
    API_ROUTES.SPRINT.COMPLETE(sprintId),
    { moveToSprintId, workspaceId }
  );

  return data;
};

export interface UpdateSprintPayload {
  name?: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  workspaceId: string;
}

export const updateSprint = async (
  sprintId: string,
  payload: UpdateSprintPayload
): Promise<SprintResponse<SprintData>> => {
  const { data } = await API.patch<SprintResponse<SprintData>>(
    `${API_ROUTES.SPRINT.BASE}/${sprintId}`,
    payload
  );

  return data;
};

export interface BurndownDataPoint {
  date: string;
  remainingHours: number;
}

export interface BurndownResponseData {
  sprintId: string;
  startDate: string;
  endDate: string;
  idealLine: BurndownDataPoint[];
  actualLine: BurndownDataPoint[];
  metrics: {
    totalEstimatedHours: number;
    currentRemainingHours: number;
    loggedHours: number;
    completedTasks: number;
    incompleteTasks: number;
  };
}

export const getSprintBurndown = async (
  sprintId: string
): Promise<SprintResponse<BurndownResponseData>> => {
  const { data } = await API.get<SprintResponse<BurndownResponseData>>(
    API_ROUTES.SPRINT.BURNDOWN(sprintId)
  );

  return data;
};

export interface SprintAllocationData {
  sprintId: string;
  members: {
    userId: string;
    fullName: string;
    profileImage: string | null;
    assignedHours: number;
    loggedHours: number;
    remainingHours: number;
    completedTasks: number;
    incompleteTasks: number;
    capacityStatus: "UNDERLOADED" | "HEALTHY" | "OVERLOADED";
  }[];
  totals: {
    assignedHours: number;
    loggedHours: number;
    remainingHours: number;
  };
}

export const getSprintAllocation = async (
  sprintId: string
): Promise<SprintResponse<SprintAllocationData>> => {
  const { data } = await API.get<SprintResponse<SprintAllocationData>>(
    API_ROUTES.SPRINT.ALLOCATION(sprintId)
  );

  return data;
};
