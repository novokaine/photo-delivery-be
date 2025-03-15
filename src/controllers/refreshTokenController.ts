import { Request, RequestHandler, Response } from "express";
import * as jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateTokens";

interface RefreshTokenRequest extends Request {
  cookies: {
    accessToken: string;
  };
}

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;

export const refreshTokenController: RequestHandler = async (
  req: RefreshTokenRequest,
  res: Response
): Promise<any> => {
  const refreshToken = req.cookies.accessToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  return jwt.verify(refreshToken, ACCESS_SECRET, (err, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/"
    });
    return res.json({ accessToken });
  });
};
