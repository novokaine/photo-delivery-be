import { Request, Response } from "express";
import fs from "fs";
import path from "path";
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
      return res.status(400).json({ error: "No files uploaded" });
    }

    const files = Array.isArray(req.files.photos)
      ? req.files.photos
      : [req.files.photos];

    for (const file of files) {
      const filePath = path.join(uploadDir, file.name);
      await file.mv(filePath);
    }

    res.status(200).json({ message: "Files uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
