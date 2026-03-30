export const AppMessages = {
  EMAIL_ALREADY_EXISTS:
    "The given email already exists. Please try a different one.",

  INVALID_EMAIL: "Invalid email address.",

  INVALID_CREDENTIALS: "Invalid email or password.",

  INVALID_AUTH_PROVIDER: "Invalid Auth Provider.",

  INVALID_GOOGLE_TOKEN: "Invalid Google Token.",

  INVALID_GOOGLE_PAYLOAD: "Invalid Google Payload",

  INVALID_GOOGLE_CODE: "Invalid Google Auth Code.",

  GOOGLE_AUTH_FAILED: "Google authentication failed.",

  OTP_INVALID_OR_EXPIRED: "OTP is invalid or has expired.",

  OTP_MAX_ATTEMPTS_REACHED:
    "Too many invalid OTP attempts. Please try again later.",

  OTP_RESEND_COOLDOWN: "Please wait before requesting a new OTP.",

  UNAUTHORIZED_ACCESS: "You are not authorized to perform this action.",

  USER_NOT_FOUND: "User not found.",

  TOKEN_EXPIRED: "Session expired. Please login again.",

  TOKEN_INVALID: "Invalid authentication token.",

  TOKEN_REFRESH_INVALID: "Invalid Refresh Token.",

  OTP_SENT: "OTP has been sent to your email.",

  OTP_RESENT: "OTP has been resent successfully.",

  EMAIL_VERIFIED: "Email verified successfully.",

  LOGIN_SUCCESS: "Login successful.",

  LOGOUT_SUCCESS: "Logout successful.",

  PASSWORD_RESET_SUCCESS: "Password reset successful.",

  EMAIL_SENT_SUCCESS: "Email sent successfully.",

  EMAIL_SENT_FAILED: "Unable to send email at the moment.",

  EMAIL_SUBJECT_OTP: "Your OTP Code",
  EMAIL_SUBJECT_RESEND_OTP: "Your Resend OTP Code",

  EMAIL_SUBJECT_RESET_PASSWORD: "Reset your password",

  EMAIL_SUBJECT_INVITE_USER: "You have been invited",

  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",

  VALIDATION_FAILED: "Invalid input data.",

  RESOURCE_NOT_FOUND: "Requested resource not found.",

  OPERATION_SUCCESS: "Operation completed successfully.",

  PLAN_NAME_ALREADY_EXISTS: "Plan name already exists",

  PLAN_CREATED: "Plan Created Successful.",

  PLAN_NOT_FOUND: "Plan not found.",

  PLAN_STATUS_UPDATED: "Plan Status updated.",

  ONBOARDING_COMPLETED: "Onboarding completed successfully",

  USER_ALREADY_ONBOARDED: "User already completed onboarding",

  USER_FETCHING_SUCCESSFUL: "User Fetching Successfull",

  WORKSPACE_NOT_FOUND: "Workspace not found",

  WORKSPACE_JOIN_SUCCESS: "Joined workspace successfully!",

  INVITATION_SENT_SUCCESS: "Invitation sent success",

  INVITATION_ALREADY_SENT: " Invitation already sent to this email",

  INVALID_INVITATION: "Invalid Invitation",

  INVITATION_EXPIRED: "Invitation Expired!",

  INVITATION_ACCEPTED: "Invitation Accepted",
  
  INVITATION_ALREADY_USED: "Invitation Already Used",
  
  MEMBER_LIMIT_EXCEEDED: "Members limit Already Exceeded",

  USER_ALREADY_MEMBER: "User Already Member in this workspace",

  USER_BLOCKED: "Your account has been blocked. Please contact support.",

  USER_BLOCK_STATUS_UPDATED: "User block status updated successfully.",

  USER_PROFILE_UPDATED: "Profile Updated Successfull",

  PROJECT_CREATED: "Project created successfully",

  PROJECT_UPDATED: "Project updated successfully",

  PROJECT_NOT_FOUND: "Project not found",

  PROJECT_LIMIT_EXCEEDED: "Projects limit already exceeded",

  INVALID_PROJECT_MEMBERS: "One or more selected project members are not part of this workspace",

  CURRENT_PASSWORD_IS_WRONG: "Current password is not matching to the exisiting password",

  PASSWORD_CHANGED_SUCCESSFUL: "Password changed ",
  
  NO_ACTIVE_PLANS: "No active pricing plans available to assign to the new workspace.",

  WORKSPACE_FETCHED_SUCCESSFULLY: "Workspaces fetched successfully",

  WORKSPACE_STATUS_UPDATED: "Workspace status updated successfully",

} as const;
