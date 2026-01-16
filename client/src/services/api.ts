import axios, { HttpStatusCode } from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/***
 *  Res Interceptor for New AccessToken By passing RefreshToken.
 */
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status == HttpStatusCode.Unauthorized &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await API.post("/auth/refresh");
        return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
