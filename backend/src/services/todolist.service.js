import TodoList from "../models/TodoList.js";
import Todo from "../models/Todo.js";

export const getLists = async (userId) => {
  return await TodoList.find({ user: userId });
};

export const getListById = async (id, userId) => {
  const list = await TodoList.findOne({ _id: id, user: userId });
  if (!list) {
    throw new Error("Checklist not found");
  }
  return list;
};

export const createList = async (title, userId) => {
  return await TodoList.create({ title, user: userId });
};

export const updateListTitle = async (id, userId, title) => {
  if (!title?.trim()) {
    throw new Error("Title is required");
  }
  const list = await TodoList.findOneAndUpdate(
    { _id: id, user: userId },
    { title },
    { new: true }
  );
  if (!list) {
    throw new Error("Checklist not found");
  }
  return list;
};

export const deleteList = async (id, userId) => {
  const list = await TodoList.findOne({ _id: id, user: userId });
  if (!list) {
    throw new Error("Checklist not found");
  }
  await Todo.deleteMany({ list: list._id });
  await list.deleteOne();
};
