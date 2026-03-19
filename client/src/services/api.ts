import axios, { HttpStatusCode } from "axios";
import { API_ROUTES } from "@/constants/api.constants";

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
    if (status === HttpStatusCode.Forbidden && 
        (message === "Your account has been blocked. Please contact support." || 
         message?.toLowerCase().includes("blocked"))) {
      
      const { AuthUserState } = await import("@/store/auth.store");
      const { toast } = await import("sonner");
      
      AuthUserState.getState().clearUser();
      toast.error("Your account has been blocked. Please contact support.");
      window.location.href = "/login?status=blocked";
      
      return Promise.reject({
        message: message || "Your account has been blocked.",
        status: status,
      });
    }

    const isAuthRoute = AUTH_ROUTES.some((route) =>
      originalRequest.url?.includes(route)
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
      } catch (refreshError: any) {
        return Promise.reject({
          message:
            refreshError?.response?.data?.message ||
            "Session expired. Please login again.",
          status: refreshError?.response?.status,
        });
      }
    }

    return Promise.reject({
      message: message || error?.message || "Something went wrong",
      status: status || error?.response?.status,
    });
  }
);
