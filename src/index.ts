import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import privateRoutes from "./routes";
import adminRoutes from "./routes/adminRoutes";
import { connectDB } from "./db";
import fileUpload from "express-fileupload";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const clientUrl = process.env.CLIEN_URL || "http://localhost:3000";

app.use(
  cors({
    origin: clientUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
connectDB();

app.use("/api/", authRoutes);
app.use("/api/private", privateRoutes);
app.use("/api/admin", adminRoutes);

app
  .listen(PORT, () => console.log(`Server is listening on ${PORT}`))
  .on("error", (err) => console.log(`Server error ${err}`));
