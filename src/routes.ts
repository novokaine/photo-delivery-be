import { Router } from "express";
import { authController } from "./controllers/authController";
import { getPrivateData } from "./controllers/protectedController";
import { authMiddleware } from "./authMiddleware";
import { registerController } from "./controllers/registerController";

const router = Router();

router.post("/login", authController);
router.post("/register", registerController);
router.get("/private", authMiddleware, getPrivateData);

export default router;
