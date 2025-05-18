import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  SUCCESS
} from "../../utils/serverResponseStatus";
import { moveFileToFolder, UPLOAD_DIR } from "../../utils/fileHandlers";

const uploadDir = "./public/rawUploads";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

interface PhotoData {
  name: string;
  dateTaken: number;
  year: number;
}

const moveFiles = () => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) throw err;
    files.map(moveFileToFolder);
  });
};

export const uploadPhotosController = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.files || !req.files.photos) {
    return res.status(BAD_REQUEST).json({ error: "No files uploaded" });
  }

  try {
    const files = Array.isArray(req.files.photos)
      ? req.files.photos
      : [req.files.photos];

    for (const file of files) {
      const filePath = path.join(uploadDir, file.name);

      await file
        .mv(filePath)
        .then(moveFiles)
        .then(() =>
          res.status(SUCCESS).json({ message: "Files uploaded successfully" })
        );
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
};
