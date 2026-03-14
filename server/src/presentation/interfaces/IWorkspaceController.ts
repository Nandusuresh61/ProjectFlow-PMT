import { Request, Response, NextFunction } from "express";

export interface IWorkspaceController {
  getMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}