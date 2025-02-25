import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
import { connectDB } from "./db";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api", routes);

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
