import Router from "express";
import {
  checkAuthController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController
} from "../controllers/authController";
import { refreshTokenController } from "../controllers/refreshTokenController";

const router = Router();

router.get("/check-auth", checkAuthController);
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh-token", refreshTokenController);
router.post("/reset-password", resetPasswordController);

export default router;
