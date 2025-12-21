import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await api.get("/todos");
      setTodos(res.data);
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;

    const res = await api.post("/todos", { title });
    setTodos((prev) => [...prev, res.data]);
    setTitle("");
  };

  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const toggleComplete = async (todo) => {
    const res = await api.put(`/todos/${todo._id}`, {
      completed: !todo.completed,
    });

    setTodos((prev) => prev.map((t) => (t._id === todo._id ? res.data : t)));
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;

    const res = await api.put(`/todos/${id}`, {
      title: editTitle,
    });

    setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    cancelEdit();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded shadow p-4">
        {/* Back to Home */}
        <Link to="/home" className="text-sm text-blue-500 hover:underline">
          ← Back to Home
        </Link>

        <h2 className="text-xl font-semibold mb-4 text-center">Manage Todos</h2>

        {/* Add Todo */}
        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 flex-1 rounded"
            placeholder="Enter a todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center">No todos yet 👀</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((t) => (
              <li
                key={t._id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded border"
              >
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(t)}
                  />

                  {editingId === t._id ? (
                    <input
                      className="border p-1 flex-1 rounded"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  ) : (
                    <span
                      onClick={() => toggleComplete(t)}
                      className={`cursor-pointer ${
                        t.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {t.title}
                    </span>
                  )}
                </div>

                {editingId === t._id ? (
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => saveEdit(t._id)}
                      className="text-green-600 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 ml-2">
                    <button
                      onClick={() => startEdit(t)}
                      className="text-blue-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(t._id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
