import { Router } from "express";
import { registerUser, userLogin } from "../controllers/UserController.js";
const router = Router();

router.post("/", registerUser)
router.post("/login", userLogin)


export default router;