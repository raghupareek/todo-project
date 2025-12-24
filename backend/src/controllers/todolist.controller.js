import {
  getLists as getListsService,
  getListById as getListByIdService,
  createList as createListService,
  updateListTitle as updateListTitleService,
  deleteList as deleteListService,
  restoreList as restoreListService,
  getDeletedLists as getDeletedListsService,
  permanentDeleteList as permanentDeleteListService,
} from "../services/todolist.service.js";

import catchErrors from "../utils/catchErrors.js";
import { validateObjectId } from "../utils/validateObjectId.js";

/**
 * Get all active todo lists
 */
export const getLists = catchErrors(async (req, res) => {
  const lists = await getListsService(req.userId);
  res.json(lists);
});

/**
 * Get single todo list by ID
 */
export const getListById = catchErrors(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid list ID" });
  }

  const list = await getListByIdService(id, req.userId);
  res.json(list);
});

/**
 * Create new todo list
 */
export const createList = catchErrors(async (req, res) => {
  const list = await createListService(req.body.title, req.userId);
  res.status(201).json(list);
});

/**
 * Update todo list title
 */
export const updateListTitle = catchErrors(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid list ID" });
  }

  const list = await updateListTitleService(id, req.userId, req.body.title);

  res.json(list);
});

/**
 * Soft delete (move to trash)
 */
export const deleteList = catchErrors(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid list ID" });
  }

  await deleteListService(id, req.userId);
  res.json({ message: "Checklist moved to trash" });
});

/**
 * Restore from trash
 */
export const restoreList = catchErrors(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid list ID" });
  }

  await restoreListService(id, req.userId);
  res.json({ message: "Checklist restored" });
});

/**
 * Get all deleted todo lists (trash)
 */
export const getDeletedLists = catchErrors(async (req, res) => {
  const lists = await getDeletedListsService(req.userId);
  res.json(lists);
});

/**
 * Permanently delete todo list
 */
export const permanentDeleteList = catchErrors(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid list ID" });
  }

  await permanentDeleteListService(id, req.userId);
  res.json({ message: "Checklist permanently deleted" });
});
