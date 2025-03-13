import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { getUsers } from "../controllers/adminControllers/manageUsers";

const router = Router();

router.get("/users", adminMiddleware, getUsers);

export default router;
