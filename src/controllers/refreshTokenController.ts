import { Request, RequestHandler, Response } from "express";
import * as jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateTokens";
import { NO_TOKEN, SUCCESS } from "../utils/serverResponseStatus";

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
    return res.status(NO_TOKEN).json({ message: "No refresh token provided" });

  return jwt.verify(
    refreshToken,
    REFRESH_SECRET,
    (err, { id, username, isAdmin }: any) => {
      if (err) {
        return res.status(NO_TOKEN).json({ message: "Invalid refresh token" });
      }

      const accessToken = generateAccessToken({
        id,
        username: username,
        isAdmin: isAdmin
      });

      return res.status(SUCCESS).json({ accessToken });
    }
  );
};
