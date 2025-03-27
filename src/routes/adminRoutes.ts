import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { getUsers } from "../controllers/adminControllers/manageUsers";
import { uploadPhotosController } from "../controllers/adminControllers/adminController";

const router = Router();

router.get("/users", adminMiddleware, getUsers);
router.post("/upload-photos", adminMiddleware, uploadPhotosController);

export default router;
