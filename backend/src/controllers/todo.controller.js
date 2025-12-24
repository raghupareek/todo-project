import {
  getTodos as getTodosService,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
  restoreTodo as restoreTodoService,
  getDeletedTodos as getDeletedTodosService,
  reorderTodos as reorderTodosService,
  permanentDeleteTodo as permanentDeleteTodoService,
} from "../services/todo.service.js";
import catchErrors from "../utils/catchErrors.js";

export const getTodos = catchErrors(async (req, res) => {
  const todos = await getTodosService(req.userId, req.query.list);
  res.json(todos);
});

export const createTodo = catchErrors(async (req, res) => {
  const { title, list, dueDate, priority, notes, labels } = req.body;
  const todo = await createTodoService(
    { title, list, dueDate, priority, notes, labels },
    req.userId
  );
  res.status(201).json(todo);
});

export const updateTodo = catchErrors(async (req, res) => {
  const { title, completed, dueDate, priority, order, notes, labels } =
    req.body;
  const todo = await updateTodoService(req.params.id, req.userId, {
    title,
    completed,
    dueDate,
    priority,
    order,
    notes,
    labels,
  });
  res.json(todo);
});

export const deleteTodo = catchErrors(async (req, res) => {
  await deleteTodoService(req.params.id, req.userId);
  res.json({ message: "Todo moved to trash" });
});

export const restoreTodo = catchErrors(async (req, res) => {
  await restoreTodoService(req.params.id, req.userId);
  res.json({ message: "Todo restored" });
});

export const getDeletedTodos = catchErrors(async (req, res) => {
  const todos = await getDeletedTodosService(req.userId);
  res.json(todos);
});

export const reorderTodos = catchErrors(async (req, res) => {
  const { listId, todoIds } = req.body;
  await reorderTodosService(listId, req.userId, todoIds);
  res.json({ message: "Todos reordered" });
});

export const permanentDeleteTodo = catchErrors(async (req, res) => {
  await permanentDeleteTodoService(req.params.id, req.userId);
  res.json({ message: "Todo permanently deleted" });
});
