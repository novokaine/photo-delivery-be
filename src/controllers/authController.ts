import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/Users";
import { generateAccessToken } from "../utils/generateTokens";

dotenv.config();

const saltRounds = 10;

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

    if (!accessToken)
      return res.status(500).json({ message: "Token generation failed" });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 2 * 60 * 60 * 100
    });

    return res.status(200).json({ isAdmin, accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    path: "/"
  });

  res.json({ message: "Logged out" });
};

export const registerController = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      username: username,
      password: hashedPassword,
      isAdmin: false
    });
    await newUser.save();
    res.status(201).json({ message: "New User added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPasswordController: (
  req: Request,
  res: Response
) => void = async (req, res) => {
  const { email } = req.body;
  // @TODO - yet to be implemented with user mail service and password reset link
  const user = await User.findOne({ email });
  // if (!user) return res.status(200).json({ message: "User not found" });
  return res.status(200).json({ message: "Success" });
};
