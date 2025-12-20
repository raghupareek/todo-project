import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "../controllers/todo.controller.js";

const router = Router();
router.use(protect);

router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
