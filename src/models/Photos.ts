import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  dateTaken: { type: String, required: true, unique: false },
  year: { type: String, required: true, unique: false }
});

export const Photos = mongoose.model("Photos", PhotoSchema);
