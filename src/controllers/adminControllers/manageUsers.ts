import { Request, Response } from "express";
import { SUCCESS } from "../../utils/serverResponseStatus";

export const getUsers = (req: Request, res: Response): any => {
  return res.status(SUCCESS).json({ message: "soon" });
};
