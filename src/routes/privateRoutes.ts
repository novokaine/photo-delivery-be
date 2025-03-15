import { Router } from "express";
import { getPrivateData } from "../controllers/protectedController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getUserDataController } from "../controllers/userControllers";

const router = Router();

router.get("/", authMiddleware, getPrivateData);
router.get("/user-profile", authMiddleware, getUserDataController);

router.post("/", authMiddleware, getPrivateData);

export default router;
