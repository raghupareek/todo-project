import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.userId });
  res.json(todos);
};

export const createTodo = async (req, res) => {
  const todo = await Todo.create({
    title: req.body.title,
    user: req.userId,
  });
  res.status(201).json(todo);
};

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
