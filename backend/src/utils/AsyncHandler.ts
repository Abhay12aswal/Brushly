import { NextFunction, Request, Response } from "express";

export const AsyncHandler =
  (fn: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
