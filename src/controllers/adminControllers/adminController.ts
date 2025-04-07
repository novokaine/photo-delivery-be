import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  SUCCESS
} from "../../utils/serverResponseStatus";
const uploadDir = "./public/uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const uploadPhotosController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    if (!req.files || !req.files.photos) {
      return res.status(BAD_REQUEST).json({ error: "No files uploaded" });
    }

    const files = Array.isArray(req.files.photos)
      ? req.files.photos
      : [req.files.photos];

    for (const file of files) {
      const filePath = path.join(uploadDir, file.name);
      await file.mv(filePath);
    }

    res.status(SUCCESS).json({ message: "Files uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
};
