export const API_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    LOGIN: "/auth/login",
    GET_ME: "/auth/getme",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot",
    RESET_PASSWORD: "/auth/reset-password",
    RESEND_OTP: "/auth/resend-otp",
    GOOGLE: "/auth/google",
    SIGNUP: "/auth/signup", // Used in interceptor routes
    REFRESH: "/auth/refresh", // Used in interceptor routes
  },
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
  },
  SECURITY: {
    UPDATE: "/profile/change-password",
  },
  WORKSPACE: {
    BASE: "/workspace",
    USER_WORKSPACES: "/workspace/user/workspaces",
    CREATE: "/workspace/create",
    CHECK_NAME: "/workspace/check-name",
    INVITE: (workspaceId: string) => `/workspace/${workspaceId}/invite`,
    ACCEPT_INVITATION: "/workspace/invite/accept",
    GET_INVITATION_DETAILS: (token: string) => `/workspace/invite/details/${token}`,
    MEMBERS: (workspaceId: string) => `/workspace/${workspaceId}/members`,
    SWITCH: (workspaceId: string) => `/workspace/${workspaceId}/switch`,
    DASHBOARD: (workspaceId: string) => `/workspace/${workspaceId}/dashboard`,
  },
  PROJECT: {
    BASE: "/project",
    LIST_BY_WORKSPACE: (workspaceId: string) => `/project/workspace/${workspaceId}`,
    UPDATE: (projectId: string) => `/project/${projectId}`,
    MEMBERS: (projectId: string) => `/project/${projectId}/members`,
    OVERVIEW: (projectId: string) => `/project/${projectId}/overview`,
  },
  ISSUE: {
    CREATE: "/issue",
    LIST_BY_PROJECT: (projectId: string) => `/issue/project/${projectId}`,
    UPDATE: (issueId: string) => `/issue/${issueId}`,
    COMMENTS: (issueId: string) => `/issue/${issueId}/comments`,
  },
  SPRINT: {
    BASE: "/sprint",
    LIST_BY_PROJECT: (projectId: string) => `/sprint/project/${projectId}`,
    ASSIGN_ISSUE: "/sprint/assign-issue",
    START: "/sprint/start",
    GET_ACTIVE: (projectId: string) => `/sprint/project/${projectId}/active`,
    GET_PERFORMANCE: (projectId: string) => `/sprint/project/${projectId}/performance`,
    COMPLETE: (sprintId: string) => `/sprint/${sprintId}/complete`,
  },
  ANALYTICS: {
    PROJECT_VELOCITY: (projectId: string) => `/projects/${projectId}/analytics/velocity`,
    PROJECT_SPRINTS: (projectId: string) => `/projects/${projectId}/analytics/sprints`,
    SPRINT: (sprintId: string) => `/sprints/${sprintId}/analytics`,
  },
  ONBOARDING: {
    COMPLETE: "/onboarding/complete",
  },
  PLAN: {
    BASE: "/plan",
    TOGGLE_STATUS: (planId: string) => `/plan/${planId}/toggle`,
  },
  SUPER_ADMIN: {
    GET_USERS: "/super-admin/getusers",
    USER_DETAILS: (userId: string) => `/super-admin/user/${userId}`,
    TOGGLE_BLOCK: (userId: string) => `/super-admin/toggle-block/${userId}`,
    GET_WORKSPACES: "/super-admin/workspaces",
    WORKSPACE_DETAILS: (workspaceId: string) => `/super-admin/workspace/${workspaceId}`,
    TOGGLE_SUSPEND: (workspaceId: string) => `/super-admin/workspace/${workspaceId}/toggle-suspend`,
  },
  WORKLOG: {
    ISSUE: (issueId: string) => `/worklog/issue/${issueId}`,
    LOG: (workLogId: string) => `/worklog/${workLogId}`,
  },
} as const;
