import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  SUCCESS
} from "../../utils/serverResponseStatus";
import {
  checkExistingDublicates,
  readAndMoveFolderFiles,
  UPLOAD_DIR
} from "../../utils/fileHandlers";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

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

    let counter = files.length;

    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file.name);
      await file.mv(filePath);
      counter--;
    }

    if (counter === 0) readAndMoveFolderFiles();
    return res.status(SUCCESS).json({ message: "File uploaded successfuly" });
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to upload photos" });
  }
};

export const checkForDublicates = async (
  req: Request,
  res: Response
): Promise<any> => {
  const files: string[] = req.body;

  if (files.length === 0) {
    return res.status(BAD_REQUEST).json({ error: "No photos to check" });
  }

  try {
    const dublicates = await checkExistingDublicates(files);
    res.status(SUCCESS).json(dublicates);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error checking files" });
  }
};
