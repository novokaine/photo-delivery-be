import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/Users";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/generateTokens";

dotenv.config();

const saltRounds = 10;
const SECRET_KEY = process.env.JWT_SECRET as string;

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

    const { id, username: userName, isAdmin } = user;

    const accessToken = generateAccessToken({
      id,
      username: userName,
      isAdmin
    });

    const refreshToken = generateRefreshToken({
      id,
      username: userName,
      isAdmin
    });

    if (!accessToken || !refreshToken)
      return res.status(500).json({ message: "Token generation failed" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/"
    });

    return res.json({ accessToken, isAdmin });
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

export const registerController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      password: hashedPassword,
      isAdmin: false
    });
    await newUser.save();
    res.status(201).json({ message: "New User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserData = async (req: Request, res: Response) => {
  const authHeader = req.body.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, SECRET_KEY);
  console.log(decoded);
  const { username, password } = req.body;

  const user = await User.findOne({ username });
};
