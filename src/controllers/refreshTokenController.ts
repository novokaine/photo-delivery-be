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
  const currentAccessToken = req.cookies.accessToken;

  if (!currentAccessToken)
    return res.status(401).json({ message: "No refresh token provided" });

  return jwt.verify(
    currentAccessToken,
    ACCESS_SECRET,
    (err, { id, username, isAdmin }: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const accessToken = generateAccessToken({
        id,
        username: username,
        isAdmin: isAdmin
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/"
      });
      return res.status(200).json({ message: "Token generated successfully" });
    }
  );
};
