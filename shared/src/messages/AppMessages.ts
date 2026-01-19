export const AppMessages = {

  EMAIL_ALREADY_EXISTS:
    "The given email already exists. Please try a different one.",

  INVALID_EMAIL:
    "Invalid email address.",

  INVALID_CREDENTIALS:
    "Invalid email or password.",

  OTP_INVALID_OR_EXPIRED:
    "OTP is invalid or has expired.",

  OTP_MAX_ATTEMPTS_REACHED:
    "Too many invalid OTP attempts. Please try again later.",

  OTP_RESEND_COOLDOWN:
    "Please wait before requesting a new OTP.",

  UNAUTHORIZED_ACCESS:
    "You are not authorized to perform this action.",

  TOKEN_EXPIRED:
    "Session expired. Please login again.",

  TOKEN_INVALID:
    "Invalid authentication token.",


  OTP_SENT:
    "OTP has been sent to your email.",

  OTP_RESENT:
    "OTP has been resent successfully.",

  EMAIL_VERIFIED:
    "Email verified successfully.",

  LOGIN_SUCCESS:
    "Login successful.",

  LOGOUT_SUCCESS:
    "Logout successful.",

  PASSWORD_RESET_SUCCESS:
    "Password reset successful.",


  EMAIL_SENT_SUCCESS:
    "Email sent successfully.",

  EMAIL_SENT_FAILED:
    "Unable to send email at the moment.",

  EMAIL_SUBJECT_OTP:
    "Your OTP Code",

  EMAIL_SUBJECT_RESET_PASSWORD:
    "Reset your password",

  EMAIL_SUBJECT_INVITE_USER:
    "You have been invited",


  INTERNAL_SERVER_ERROR:
    "Something went wrong. Please try again later.",

  VALIDATION_FAILED:
    "Invalid input data.",

  RESOURCE_NOT_FOUND:
    "Requested resource not found.",

  OPERATION_SUCCESS:
    "Operation completed successfully.",

} as const;
