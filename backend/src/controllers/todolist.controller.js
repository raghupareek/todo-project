import TodoList from "../models/TodoList.js";
import Todo from "../models/Todo.js";

/**
 * GET all checklists for logged-in user
 */
export const getLists = async (req, res) => {
  const lists = await TodoList.find({ user: req.userId });
  res.json(lists);
};

/**
 * GET single checklist by ID
 */
export const getListById = async (req, res) => {
  const list = await TodoList.findOne({
    _id: req.params.id,
    user: req.userId,
  });

  if (!list) {
    return res.status(404).json({ message: "Checklist not found" });
  }

  res.json(list);
};

/**
 * CREATE new checklist
 */
export const createList = async (req, res) => {
  const list = await TodoList.create({
    title: req.body.title,
    user: req.userId,
  });
  res.status(201).json(list);
};

/**
 * UPDATE checklist title
 */
export const updateListTitle = async (req, res) => {
  const { title } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const list = await TodoList.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { title },
    { new: true }
  );

  if (!list) {
    return res.status(404).json({ message: "Checklist not found" });
  }

  res.json(list);
};

/**
 * DELETE checklist + all its todos
 */
export const deleteList = async (req, res) => {
  const list = await TodoList.findOne({
    _id: req.params.id,
    user: req.userId,
  });

  if (!list) {
    return res.status(404).json({ message: "Checklist not found" });
  }

  // IMPORTANT: delete all todos in this list
  await Todo.deleteMany({ list: list._id });

  await list.deleteOne();
  res.json({ message: "Checklist deleted" });
};
