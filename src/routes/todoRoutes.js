import { Router } from "express";
import { createTodos, deleteTodos, getTodos, getTodosById, updateTodos } from "../controllers/todoController.js"
import verifyToken from "../middlewares/auth.js";
const router = Router();

router.use(verifyToken);

router.get("/", getTodos)
router.get("/:id", getTodosById)
router.post("/", createTodos)
router.put("/:id",updateTodos)
router.delete("/:id", deleteTodos)

export default router;