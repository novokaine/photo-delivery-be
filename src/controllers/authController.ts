import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/Users";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/generateTokens";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  SUCCESS,
  UNAUTHORIZED
} from "../utils/serverResponseStatus";

dotenv.config();

const saltRounds = 10;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export const loginController: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(BAD_REQUEST).json({ message: "Invalid credentials" });
    }

    const { id, username: userName, isAdmin, email } = user;

    const accessToken = generateAccessToken({
      id,
      username: userName,
      isAdmin
    });

    const refreshToken = generateRefreshToken({
      id,
      username: userName
    });

    if (!accessToken || !refreshToken)
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Token generation failed" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(SUCCESS).json({
      userData: { userName, isAdmin, email },
      accessToken
    });
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
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
  const { email, username, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(BAD_REQUEST).json({ message: "User already exists" });
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
    res.status(CREATED).json({ message: "New User added successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
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
  return res.status(SUCCESS).json({ message: "Success" });
};

// @TODO - investigate promise return type
export const checkAuthController: (
  req: Request,
  res: Response
) => Promise<any> = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    if (typeof decoded !== "object")
      return res.status(NOT_FOUND).json({ message: "User Not found" });

    const { id } = decoded;
    const user = await User.findById({ _id: id });

    if (!user) return res.status(NOT_FOUND).json({ message: "User not found" });

    const { email, username, isAdmin } = user;
    const accessToken = generateAccessToken({ id, username, isAdmin });
    return res
      .status(SUCCESS)
      .json({ userData: { username, email, isAdmin }, accessToken });
  } catch (err) {
    return res.status(UNAUTHORIZED).json({ message: "Invalid token" });
  }
};
