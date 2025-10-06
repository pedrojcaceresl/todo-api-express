import { Router } from "express";
import { createTodos, getTodos, getTodosById } from "../controllers/todoController.js"
const router = Router();

router.get("/", getTodos)

router.get("/:id", getTodosById)

router.post("/", createTodos)

export default router;