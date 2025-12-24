import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getLists,
  createList,
  deleteList,
  updateListTitle,
  getListById,
  restoreList,
  getDeletedLists,
  permanentDeleteList,
} from "../controllers/todolist.controller.js";

const router = Router();
router.use(protect);

// STATIC routes first
router.get("/deleted", getDeletedLists);

// BASE routes
router.get("/", getLists);
router.post("/", createList);

// PARAM routes
router.get("/:id", getListById);
router.put("/:id", updateListTitle);
router.delete("/:id", deleteList);

// NESTED param routes
router.put("/:id/restore", restoreList);
router.delete("/:id/permanent", permanentDeleteList);

export default router;
