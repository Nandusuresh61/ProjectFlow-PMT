import { config } from "@/app.config";
import { Response } from "express";
import { IAuthCookieService } from "@/application/interfaces/services/IAuthCookieService";

export const COOKIE_NAMES = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
};

export class AuthCookieService implements IAuthCookieService {
  private baseOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  private get refreshOptions() {
    return {
      ...this.baseOptions,
      path: "/api/auth" + config.REFRESH_TOKEN_PATH,
    };
  }

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ) {
    res.cookie(COOKIE_NAMES.ACCESS, accessToken, {
      ...this.baseOptions,
      maxAge: config.ACCESS_TOKEN_COOKIE_MAX_AGE,
    });

    res.cookie(COOKIE_NAMES.REFRESH, refreshToken, {
      ...this.refreshOptions,
      maxAge: config.REFRESH_TOKEN_COOKIE_MAX_AGE,
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie(COOKIE_NAMES.ACCESS, this.baseOptions);
    res.clearCookie(COOKIE_NAMES.REFRESH, this.refreshOptions);
  }
}