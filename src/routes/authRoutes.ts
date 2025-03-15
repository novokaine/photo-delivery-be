import Router from "express";
import {
  loginController,
  logoutController,
  registerController
} from "../controllers/authController";
import { refreshTokenController } from "../controllers/refreshTokenController";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh-token", refreshTokenController);

export default router;
