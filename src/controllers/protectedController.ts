import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { FORBIDDEN, UNAUTHORIZED } from "../utils/serverResponseStatus";

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;

export const getPrivateData = (req: Request, res: Response): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(FORBIDDEN).json({ message: "Forbidden" });

    return res.json({ message: "Protected content", user });
  });
};
