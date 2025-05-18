import path from "path";
import ExifReader from "exifreader";
import fs from "fs";
export const UPLOAD_DIR = "./public/rawUploads";

// Returns proper folders names based on photo created date
const getFoldersName = (dateCreated: Date) => {
  console.log(dateCreated);
  const date = new Date(dateCreated);
  const year = new Date(dateCreated).getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthString = month < 10 ? `0${month}` : month;
  const dayString = day < 10 ? `0${day}` : day;
  const yearFolder = `./public/${year}`;
  const dateFolder = `${year}-${monthString}-${dayString}`;

  return { yearFolder, dateFolder };
};

export const moveFileToFolder = async (file: string) => {
  const filePath = path.join(UPLOAD_DIR, file);
  const fileData = await ExifReader.load(filePath);
  const {
    CreateDate: { value }
  } = fileData;
  const { yearFolder, dateFolder } = getFoldersName(value as unknown as Date);

  if (!fs.existsSync(yearFolder)) {
    fs.mkdirSync(yearFolder);
  }

  if (!fs.existsSync(`${yearFolder}/${dateFolder}`)) {
    fs.mkdirSync(`${yearFolder}/${dateFolder}`);
  }
  const pathToMove = path.join(`${yearFolder}/${dateFolder}`, file);
  fs.rename(filePath, pathToMove, () => {});
};
