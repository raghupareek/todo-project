import TodoList from "../models/TodoList.js";
import Todo from "../models/Todo.js";
import appAssert from "../utils/appAssert.js";
import AppErrorCode from "../constants/appErrorCode.js";
import { BAD_REQUEST, NOT_FOUND } from "../constants/http.js";

export const getLists = async (userId) => {
  const lists = await TodoList.find({ user: userId, deleted: false });
  // Add todo stats for each list
  const listsWithStats = await Promise.all(
    lists.map(async (list) => {
      const todos = await Todo.find({ list: list._id, deleted: false });
      const totalTodos = todos.length;
      const completedTodos = todos.filter((t) => t.completed).length;
      const upcomingDue = todos.filter(
        (t) => t.dueDate && new Date(t.dueDate) > new Date() && !t.completed
      ).length;
      return {
        ...list.toObject(),
        stats: {
          total: totalTodos,
          completed: completedTodos,
          upcomingDue,
        },
      };
    })
  );
  return listsWithStats;
};

export const getListById = async (id, userId) => {
  const list = await TodoList.findOne({ _id: id, user: userId });
  appAssert(
    list,
    NOT_FOUND,
    "Checklist not found",
    AppErrorCode.LIST_NOT_FOUND
  );
  return list;
};

export const createList = async (title, userId) => {
  return await TodoList.create({ title, user: userId });
};

export const updateListTitle = async (id, userId, title) => {
  appAssert(
    title?.trim(),
    BAD_REQUEST,
    "Title is required",
    AppErrorCode.LIST_MISSING_TITLE
  );
  const list = await TodoList.findOneAndUpdate(
    { _id: id, user: userId },
    { title },
    { new: true }
  );
  appAssert(
    list,
    NOT_FOUND,
    "Checklist not found",
    AppErrorCode.LIST_NOT_FOUND
  );
  return list;
};

export const deleteList = async (id, userId) => {
  const list = await TodoList.findOne({ _id: id, user: userId });
  appAssert(
    list,
    NOT_FOUND,
    "Checklist not found",
    AppErrorCode.LIST_NOT_FOUND
  );
  // Soft delete the list and all its todos
  await Todo.updateMany({ list: list._id }, { deleted: true });
  list.deleted = true;
  await list.save();
};

export const restoreList = async (id, userId) => {
  const list = await TodoList.findOne({ _id: id, user: userId });
  appAssert(
    list,
    NOT_FOUND,
    "Checklist not found",
    AppErrorCode.LIST_NOT_FOUND
  );
  // Restore the list and all its todos
  await Todo.updateMany({ list: list._id }, { deleted: false });
  list.deleted = false;
  await list.save();
};

export const getDeletedLists = async (userId) => {
  return await TodoList.find({ user: userId, deleted: true }).sort({
    updatedAt: -1,
  });
};

export const permanentDeleteList = async (id, userId) => {
  const list = await TodoList.findOne({ _id: id, user: userId, deleted: true });
  appAssert(
    list,
    NOT_FOUND,
    "Checklist not found in trash",
    AppErrorCode.LIST_NOT_FOUND
  );
  await Todo.deleteMany({ list: list._id });
  await list.deleteOne();
};
