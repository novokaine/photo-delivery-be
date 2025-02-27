import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/Users";

const SECRET_KEY = process.env.JWT_SECRET as string;

export const authController: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h"
    });

    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "api/auth/refreshToken"
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
