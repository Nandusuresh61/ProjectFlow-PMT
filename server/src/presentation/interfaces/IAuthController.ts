import { Request, Response } from "express";
export interface IAuthController {
  startRegister(req: Request, res: Response): Promise<void>;
  verifyOtp(req:Request,res:Response):Promise<void>;

}
