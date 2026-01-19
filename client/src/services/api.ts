import axios, { HttpStatusCode } from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await API.post("/auth/refresh");
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
  },
);
