import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      isAuthenticated: () => boolean,
    }
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({ message: 'login required' });
  }
}

export const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({ message: 'Already logged in' });
  }
}
