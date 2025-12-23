import {
  getTodos as getTodosService,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
} from "../services/todo.service.js";
import catchErrors from "../utils/catchErrors.js";

export const getTodos = catchErrors(async (req, res) => {
  const todos = await getTodosService(req.userId, req.query.list);
  res.json(todos);
});

export const createTodo = catchErrors(async (req, res) => {
  const { title, list } = req.body;
  const todo = await createTodoService(title, list, req.userId);
  res.status(201).json(todo);
});

export const updateTodo = catchErrors(async (req, res) => {
  const { title, completed } = req.body;
  const todo = await updateTodoService(req.params.id, req.userId, {
    title,
    completed,
  });
  res.json(todo);
});

export const deleteTodo = catchErrors(async (req, res) => {
  await deleteTodoService(req.params.id, req.userId);
  res.json({ message: "Todo deleted" });
});
