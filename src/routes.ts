import { Router } from "express";
import { login } from "./controllers/authController";
import { getPrivateData } from "./controllers/protectedController";
import { authMiddleware } from "./authMiddleware";
import { register } from "./controllers/authController";

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.get("/private", authMiddleware, getPrivateData);

export default router;
