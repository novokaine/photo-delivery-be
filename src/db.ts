import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONG_URI = process.env.MONGO_URI as string;

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected");
      return;
    }

    await mongoose.connect(MONG_URI);
    console.log("Connected to the database");
  } catch (error) {
    console.log("Error connecting to the database: ", error);
    process.exit(1);
  }
};
