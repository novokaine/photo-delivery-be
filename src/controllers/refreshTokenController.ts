import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

interface RefreshTokenRequest extends Request {
  cookies: {
    refreshToken: string;
  };
}

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

const generateAccessToken = (user: any) =>
  jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user: string) =>
  jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });

export const refreshTokenController = async (
  req: RefreshTokenRequest,
  res: Response
) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided" });
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const accessToken = generateAccessToken({ user: user?.username });
    res.json({ accessToken });
  });
};
