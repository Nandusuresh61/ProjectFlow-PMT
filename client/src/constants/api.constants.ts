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
    INVITE: (workspaceId: string) => `/workspace/${workspaceId}/invite`,
    ACCEPT_INVITATION: "/workspace/invite/accept",
    MEMBERS: (workspaceId: string) => `/workspace/${workspaceId}/members`,
    SWITCH: (workspaceId: string) => `/workspace/${workspaceId}/switch`,
  },
  PROJECT: {
    BASE: "/project",
    LIST_BY_WORKSPACE: (workspaceId: string) => `/project/workspace/${workspaceId}`,
    UPDATE: (projectId: string) => `/project/${projectId}`,
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
  },
} as const;
