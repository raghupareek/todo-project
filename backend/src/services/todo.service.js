import Todo from "../models/Todo.js";
import appAssert from "../utils/appAssert.js";
import AppErrorCode from "../constants/appErrorCode.js";
import { BAD_REQUEST, NOT_FOUND } from "../constants/http.js";

export const getTodos = async (userId, listId, includeDeleted = false) => {
  const filter = { user: userId };
  if (listId) filter.list = listId;
  if (!includeDeleted) filter.deleted = false;
  return await Todo.find(filter).sort({ order: 1, createdAt: 1 });
};

export const createTodo = async (data, userId) => {
  const { title, list, dueDate, priority, notes, labels } = data;
  appAssert(
    list,
    BAD_REQUEST,
    "Checklist (list) is required",
    AppErrorCode.TODO_MISSING_LIST
  );
  appAssert(
    title,
    BAD_REQUEST,
    "Title is required",
    AppErrorCode.TODO_MISSING_TITLE
  );

  // Get the highest order in the list
  const lastTodo = await Todo.findOne({ list, user: userId }).sort({
    order: -1,
  });
  const order = lastTodo ? lastTodo.order + 1 : 0;

  return await Todo.create({
    title,
    list,
    user: userId,
    dueDate,
    priority: priority || "",
    order,
    notes,
    labels: labels || [],
  });
};

export const updateTodo = async (id, userId, updates) => {
  const todo = await Todo.findOne({ _id: id, user: userId });
  appAssert(todo, NOT_FOUND, "Todo not found", AppErrorCode.TODO_NOT_FOUND);

  const allowedFields = [
    "title",
    "completed",
    "dueDate",
    "priority",
    "order",
    "notes",
    "labels",
  ];
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      todo[field] = updates[field];
    }
  });

  return await todo.save();
};

export const deleteTodo = async (id, userId) => {
  const todo = await Todo.findOne({ _id: id, user: userId });
  appAssert(todo, NOT_FOUND, "Todo not found", AppErrorCode.TODO_NOT_FOUND);
  todo.deleted = true;
  await todo.save();
};

export const restoreTodo = async (id, userId) => {
  const todo = await Todo.findOne({ _id: id, user: userId });
  appAssert(todo, NOT_FOUND, "Todo not found", AppErrorCode.TODO_NOT_FOUND);
  todo.deleted = false;
  await todo.save();
};

export const getDeletedTodos = async (userId) => {
  return await Todo.find({ user: userId, deleted: true }).sort({
    updatedAt: -1,
  });
};

export const reorderTodos = async (listId, userId, todoIds) => {
  const todos = await Todo.find({
    _id: { $in: todoIds },
    list: listId,
    user: userId,
  });
  appAssert(
    todos.length === todoIds.length,
    BAD_REQUEST,
    "Some todos not found",
    AppErrorCode.TODO_NOT_FOUND
  );

  const updatePromises = todoIds.map((id, index) =>
    Todo.findByIdAndUpdate(id, { order: index })
  );
  await Promise.all(updatePromises);
};

export const permanentDeleteTodo = async (id, userId) => {
  const todo = await Todo.findOne({ _id: id, user: userId, deleted: true });
  appAssert(
    todo,
    NOT_FOUND,
    "Todo not found in trash",
    AppErrorCode.TODO_NOT_FOUND
  );
  await todo.deleteOne();
};
