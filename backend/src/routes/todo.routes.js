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

router.get("/", getTodos); // supports ?list=LIST_ID
router.post("/", createTodo); // requires list
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
