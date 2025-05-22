import path from "path";
import ExifReader from "exifreader";
import fs, { promises as fsPromises } from "fs";
import { PhotoData } from "../types/Photo";
import { Photos } from "../models/Photos";
export const UPLOAD_DIR = "./public/rawUploads";

const dbCollector: PhotoData[] = [];

// Returns proper folders names based on photo created date
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

export const moveFilesToFolder = (file: string): Promise<void> => {
  const filePath = path.join(UPLOAD_DIR, file);
  return new Promise(async (resolve, reject) => {
    try {
      const exifData = await ExifReader.load(filePath);

      const {
        CreateDate: { value }
      } = exifData;

      const { destinationDirectory } = getDestinationDirectory(
        value as unknown as Date
      );

      const pathToMove = path.join(destinationDirectory, file);

      fs.rename(filePath, pathToMove, (err) => {
        if (err) {
          console.error(`Error moving file ${file}`, err);
          return reject(err);
        }
        const photoData: PhotoData = {
          name: file,
          dateTaken: value as unknown as Date,
          year: new Date(value).getFullYear()
        };
        dbCollector.push(photoData);
        resolve();
      });
    } catch (err) {
      console.error(`Error processing file ${file} for exif data `, err);
      reject(err);
    }
  });
};

const updatePhotoDb = async () => {
  const currentPhotos = await Photos.find({});

  await Photos.insertMany(dbCollector, { ordered: false })
    .then(() => console.log("Photos inserted successfully"))
    .catch((err) => console.error(err));
};

export const readAndMoveFolderFiles = async () => {
  try {
    const files = await fsPromises.readdir(UPLOAD_DIR);
    if (files.length === 0) {
      return;
    }
    const moveFiles = files.map((file) => moveFilesToFolder(file));

    await Promise.all(moveFiles).then(() => updatePhotoDb());
  } catch (err) {
    console.error("Error in handling photo moves ", err);
  }
};
