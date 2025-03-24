import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/Users";

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;

export const getUserDataController: (req: any, res: Response) => void = async (
  req,
  res
) => {
  const authToken = req.cookies.accessToken;
  if (!authToken) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(authToken, ACCESS_SECRET);

  if (!decoded) return res.status(403).json({ message: "Access denied" });

  const { username, email, isAdmin } = req.user;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ message: { username, email, isAdmin } });
};
