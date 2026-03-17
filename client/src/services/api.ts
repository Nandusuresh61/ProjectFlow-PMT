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

    const isAuthRoute = AUTH_ROUTES.some((route) =>
      originalRequest.url?.includes(route)
    );

    if (isAuthRoute) {
      return Promise.reject({
        message:
          error?.response?.data?.message ||
          "Authentication failed",
        status: error?.response?.status,
      });
    }

    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry
    ) {
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
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
      status: error?.response?.status,
    });
  }
);
