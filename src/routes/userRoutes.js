import { Router } from "express";
import { registerUser } from "../controllers/UserController.js";
const router = Router();

router.post("/", registerUser)

export default router;