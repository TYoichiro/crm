import { Request, Response, NextFunction } from "express";

export const AUTH_COOKIE_NAME = "crm_user";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies?.[AUTH_COOKIE_NAME]) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
