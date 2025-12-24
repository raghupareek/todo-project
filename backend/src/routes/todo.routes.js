import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  restoreTodo,
  getDeletedTodos,
  reorderTodos,
  permanentDeleteTodo,
} from "../controllers/todo.controller.js";

const router = Router();
router.use(protect);

router.get("/", getTodos); // supports ?list=LIST_ID
router.post("/", createTodo); // requires list
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

router.get("/deleted", getDeletedTodos);
router.put("/:id/restore", restoreTodo);
router.post("/reorder", reorderTodos);
router.delete("/:id/permanent", permanentDeleteTodo);

export default router;
