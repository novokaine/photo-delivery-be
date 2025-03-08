import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/Users";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/generateTokens";

dotenv.config();

export const loginController: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({
      id: user.id,
      username: user.username
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      username: user.username
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/"
    });

    return res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    path: "/"
  });

  res.json({ message: "Logged out" });
};
