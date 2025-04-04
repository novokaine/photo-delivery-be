import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.cookies.accessToken;

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    if (!(decoded as any).isAdmin)
      return res.status(403).json({ message: "Access denied. Admins only" });

    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
