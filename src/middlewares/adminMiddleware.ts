import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  NO_TOKEN,
  TOKEN_EXPIRED,
  UNAUTHORIZED
} from "../utils/serverResponseStatus";

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token)
    return res
      .status(NO_TOKEN)
      .json({ message: "Access denied. No token provided" });

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    if (!(decoded as any).isAdmin)
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Access denied. Admins only" });

    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(TOKEN_EXPIRED).json({ message: "Invalid or expired token" });
    return;
  }
};
