import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Secret Keys
const ACCESS_SECRET = process.env.ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

// Generate Tokens
export const generateAccessToken = (user: {
  id: string;
  username: string;
  isAdmin: boolean;
}) =>
  jwt.sign(user, ACCESS_SECRET, {
    expiresIn: "15s"
  });

export const generateRefreshToken = (user: {
  id: string;
  username: string;
  isAdmin: boolean;
}) => jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
