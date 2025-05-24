import path from "path";
import ExifReader from "exifreader";
import fs, { promises as fsPromises } from "fs";
import { PhotoData } from "../types/Photo";
import { Photos } from "../models/Photos";
export const UPLOAD_DIR = "./public/rawUploads";

let dbCollector: PhotoData[] = [];

// Create and returns directory path names based on photo created date
const getDestinationDirectory = (dateCreated: Date) => {
  const date = new Date(dateCreated);
  const year = new Date(dateCreated).getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthString = month < 10 ? `0${month}` : month;
  const dayString = day < 10 ? `0${day}` : day;
  const dateFolder = `${year}-${monthString}-${dayString}`;

  const destinationDirectory = path.join(`./public/${year}`, `${dateFolder}`);

  if (!fs.existsSync(`./public/${year}`)) {
    fs.mkdirSync(`./public/${year}`);
  }

  if (!fs.existsSync(destinationDirectory)) {
    fs.mkdirSync(destinationDirectory);
  }

  return { destinationDirectory };
};

const moveFilesToFolder = async (file: string): Promise<void> => {
  const filePath = path.join(UPLOAD_DIR, file);
  try {
    const exifData = await ExifReader.load(filePath);
    const {
      CreateDate: { value }
    } = exifData;

    const { destinationDirectory } = getDestinationDirectory(
      value as unknown as Date
    );

    const pathToMove = path.join(destinationDirectory, file);

    await fsPromises.rename(filePath, pathToMove).then(() => {
      const photoData: PhotoData = {
        name: file,
        dateTaken: value as unknown as Date,
        year: new Date(value).getFullYear()
      };
      dbCollector.push(photoData);
    });
  } catch (err) {
    throw err;
  }
};

const updatePhotoDb = async () => {
  const newPhotoCollection = dbCollector.map(({ name }) => name);

  const existing = await Photos.find(
    { name: { $in: newPhotoCollection } },
    { name: 1 }
  ).then((result) => result.map(({ name }) => name));

  const filtered = dbCollector.filter(({ name }) => !existing.includes(name));

  if (filtered.length === 0) {
    return { message: "No photos to insert" };
  }

  await Photos.insertMany(filtered, { ordered: false })
    .then(() => {
      dbCollector = [];
      return "Photos uploaded successfully";
    })
    .catch((err) => {
      throw err;
    });
};

export const readAndMoveFolderFiles = async () => {
  try {
    const files = await fsPromises.readdir(UPLOAD_DIR);

    if (files.length === 0) {
      return;
    }

    const filesToMove = files.map((file) => moveFilesToFolder(file));
    await Promise.all(filesToMove).then(() => updatePhotoDb());
  } catch (err) {
    throw err;
  }
};

export const checkExistingDublicates = async (files: string[]) =>
  await Photos.find({ name: { $in: files } }, { name: 1 }).then((result) =>
    result.map(({ name }) => name)
  );
