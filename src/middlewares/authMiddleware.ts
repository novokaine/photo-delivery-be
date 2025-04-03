import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_EXPIRED, UNAUTHORIZED } from "../utils/serverResponseStatus";

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    res
      .status(UNAUTHORIZED)
      .json({ message: "Access denied. No token provided" });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, ACCESS_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(TOKEN_EXPIRED).json({ message: "Invalid or expired token" });
    return;
  }
};
