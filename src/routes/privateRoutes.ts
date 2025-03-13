import { Router } from "express";
import { getPrivateData } from "../controllers/protectedController";
import { authMiddleware } from "../authMiddleware";

const router = Router();

// @ts-ignore
router.get("/", authMiddleware, getPrivateData);
// @ts-ignore
router.post("/", authMiddleware, getPrivateData);

export default router;
