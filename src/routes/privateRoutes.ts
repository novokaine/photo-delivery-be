import { Router } from "express";
import { getPrivateData } from "../controllers/protectedController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getPrivateData);
router.post("/", authMiddleware, getPrivateData);

export default router;
