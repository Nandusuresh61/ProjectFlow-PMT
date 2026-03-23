import { Response } from "express";

export interface IAuthCookieService {
  setAuthCookies(res: Response, accessToken: string, refreshToken: string): void;
  clearAuthCookies(res: Response): void;
}
