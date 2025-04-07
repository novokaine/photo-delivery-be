import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/Users";
import {
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED
} from "../../utils/serverResponseStatus";

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;

export const getUserDataController: (req: any, res: Response) => void = async (
  req,
  res
) => {
  const authToken = req.cookies.accessToken;
  if (!authToken)
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });

  const decoded = jwt.verify(authToken, ACCESS_SECRET);

  if (!decoded) return res.status(FORBIDDEN).json({ message: "Access denied" });

  const { username, email, isAdmin } = req.user;
  const user = await User.findOne({ username });
  if (!user) return res.status(NOT_FOUND).json({ message: "User not found" });
  return res.json({ message: { username, email, isAdmin } });
};
