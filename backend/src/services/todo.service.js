import Todo from "../models/Todo.js";

export const getTodos = async (userId, listId) => {
  const filter = { user: userId };
  if (listId) filter.list = listId;
  return await Todo.find(filter);
};

export const createTodo = async (title, list, userId) => {
  if (!list) {
    throw new Error("Checklist (list) is required");
  }
  return await Todo.create({ title, list, user: userId });
};

export const updateTodo = async (id, userId, updates) => {
  const todo = await Todo.findOne({ _id: id, user: userId });
  if (!todo) {
    throw new Error("Todo not found");
  }
  if (updates.title !== undefined) todo.title = updates.title;
  if (updates.completed !== undefined) todo.completed = updates.completed;
  return await todo.save();
};

export const deleteTodo = async (id, userId) => {
  const todo = await Todo.findOne({ _id: id, user: userId });
  if (!todo) {
    throw new Error("Todo not found");
  }
  await todo.deleteOne();
};
