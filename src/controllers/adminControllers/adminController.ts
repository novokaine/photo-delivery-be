import { Request, Response } from "express";

export const uploadPhotos = (req: Request, res: Response) => {
  console.log("here soon");
  res.status(200).json({ mesage: "soon" });
};
