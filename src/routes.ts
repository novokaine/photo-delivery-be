import { Router } from "express";
import {
  loginController,
  logoutController
} from "./controllers/userController";
import { getPrivateData } from "./controllers/protectedController";
import { authMiddleware } from "./authMiddleware";
import { registerController } from "./controllers/registerController";
import { refreshTokenController } from "./controllers/refreshTokenController";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh-token", refreshTokenController);

// @ts-ignore
router.get("/private", authMiddleware, getPrivateData);

export default router;
