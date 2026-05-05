import axios, { HttpStatusCode } from "axios";
import { API_ROUTES } from "@/constants/api.constants";
import { AuthUserState } from "@/store/auth.store";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/utils/error";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_ROUTES = [
  API_ROUTES.AUTH.LOGIN,
  API_ROUTES.AUTH.SIGNUP,
  API_ROUTES.AUTH.REFRESH,
];

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;
    if (
      status === HttpStatusCode.Forbidden &&
      (message === "Your account has been blocked. Please contact support." ||
        message?.toLowerCase().includes("blocked"))
    ) {
      AuthUserState.getState().clearUser();
      toast.error("Your account has been blocked. Please contact support.");
      window.location.href = "/login?status=blocked";

      return Promise.reject({
        message: message || "Your account has been blocked.",
        status: status,
      });
    }

    const isAuthRoute = AUTH_ROUTES.some((route) =>
      originalRequest.url?.includes(route),
    );

    if (isAuthRoute) {
      return Promise.reject({
        message: message || "Authentication failed",
        status: status,
      });
    }

    if (status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await API.post(import.meta.env.VITE_REFRESH_TOKEN_PATH);
        return API(originalRequest);
      } catch (refreshError: unknown) {
        AuthUserState.getState().clearUser();
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject({
          message:
            getErrorMessage(refreshError) ||
            "Session expired. Please login again.",
          status: axios.isAxiosError(refreshError) ? refreshError.response?.status : undefined,
        });
      }
    }

    return Promise.reject({
      message: message || getErrorMessage(error) || "Something went wrong",
      status: status || error?.response?.status,
    });
  },
);
