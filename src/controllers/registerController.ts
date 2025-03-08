import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/Users";

const saltRounds = 10;
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
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: "New User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
