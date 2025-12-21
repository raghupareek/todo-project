import Todo from "../models/Todo.js";

/* ================= GET TODOS ================= */
export const getTodos = async (req, res) => {
  const filter = { user: req.userId };
  if (req.query.list) filter.list = req.query.list;
  const todos = await Todo.find(filter);
  res.json(todos);
};

/* ================= CREATE TODO ================= */
export const createTodo = async (req, res) => {
  const { title, list } = req.body;

  if (!list) {
    return res.status(400).json({ message: "Checklist (list) is required" });
  }

  const todo = await Todo.create({
    title,
    list, // 👈 NEW
    user: req.userId,
  });

  res.status(201).json(todo);
};

/* ================= UPDATE TODO ================= */
export const updateTodo = async (req, res) => {
  const { title, completed } = req.body;

  const todo = await Todo.findOne({
    _id: req.params.id,
    user: req.userId,
  });

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  await todo.save();
  res.json(todo);
};

/* ================= DELETE TODO ================= */
export const deleteTodo = async (req, res) => {
  const todo = await Todo.findOne({
    _id: req.params.id,
    user: req.userId,
  });

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  await todo.deleteOne();
  res.json({ message: "Todo deleted" });
};
