import { Request, Response } from "express";

export const getUsers = (req: Request, res: Response): any => {
  return res.status(200).json({ message: "soon" });
};
