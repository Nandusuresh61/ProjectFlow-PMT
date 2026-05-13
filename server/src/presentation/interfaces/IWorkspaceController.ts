import { Request, Response, NextFunction } from "express";

export interface IWorkspaceController {
  getMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  
  getUserWorkspaces(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  switchWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  createWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}