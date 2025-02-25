import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/Users";

const SECRET_KEY = process.env.JWT_SECRET as string;

const saltRounds = 10;
export const register = async (req: Request, res: Response) => {
  const username = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "New User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login: (req: Request, res: Response) => void = async (
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
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
