import Router from "express";
import { getUserDataController } from "../controllers/userControllers/";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();

router.get("/user-profile", authMiddleware, getUserDataController);

export default router;
