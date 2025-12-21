import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getLists,
  createList,
  deleteList,
  updateListTitle,
  getListById,
} from "../controllers/todolist.controller.js";

const router = Router();
router.use(protect);

router.get("/", getLists);
router.get("/:id", getListById);
router.post("/", createList);
router.put("/:id", updateListTitle);
router.delete("/:id", deleteList);

export default router;
