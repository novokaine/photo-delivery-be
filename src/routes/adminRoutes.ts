import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { getUsers } from "../controllers/adminControllers/manageUsers";
import { uploadPhotos } from "../controllers/adminControllers/adminController";

const router = Router();

router.get("/users", adminMiddleware, getUsers);
router.post("/upload-photos", adminMiddleware, uploadPhotos);

export default router;
