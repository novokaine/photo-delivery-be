import { Request, RequestHandler, Response } from "express";
import * as jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateTokens";

interface RefreshTokenRequest extends Request {
  cookies: {
    refreshToken: string;
  };
}

const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export const refreshTokenController: RequestHandler = async (
  req: RefreshTokenRequest,
  res: Response
): Promise<any> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  return jwt.verify(refreshToken, REFRESH_SECRET, (err, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken({
      id: user.id,
      username: user.username
    });
    return res.json({ accessToken });
  });
};
