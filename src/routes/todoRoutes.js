import { Router } from "express";
import { createTodos, deleteTodos, getTodos, getTodosById, updateTodos } from "../controllers/todoController.js"
const router = Router();

router.get("/", getTodos)

router.get("/:id", getTodosById)

router.post("/", createTodos)

router.put("/:id",updateTodos)

router.delete("/:id", deleteTodos)
export default router;