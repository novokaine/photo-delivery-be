import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { getUsers } from "../controllers/adminControllers/manageUsers";
import {
  checkForDublicates,
  uploadPhotosController
} from "../controllers/adminControllers/adminController";

const router = Router();

router.get("/users", adminMiddleware, getUsers);
router.post("/check-dublicates", adminMiddleware, checkForDublicates);
router.post("/upload-photos", adminMiddleware, uploadPhotosController);

export default router;
