import {
  getLists as getListsService,
  getListById as getListByIdService,
  createList as createListService,
  updateListTitle as updateListTitleService,
  deleteList as deleteListService,
} from "../services/todolist.service.js";
import catchErrors from "../utils/catchErrors.js";

export const getLists = catchErrors(async (req, res) => {
  const lists = await getListsService(req.userId);
  res.json(lists);
});

export const getListById = catchErrors(async (req, res) => {
  const list = await getListByIdService(req.params.id, req.userId);
  res.json(list);
});

export const createList = catchErrors(async (req, res) => {
  const list = await createListService(req.body.title, req.userId);
  res.status(201).json(list);
});

export const updateListTitle = catchErrors(async (req, res) => {
  const list = await updateListTitleService(
    req.params.id,
    req.userId,
    req.body.title
  );
  res.json(list);
});

export const deleteList = catchErrors(async (req, res) => {
  await deleteListService(req.params.id, req.userId);
  res.json({ message: "Checklist deleted" });
});
