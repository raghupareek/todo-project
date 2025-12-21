import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await api.get("/todos");
      setTodos(res.data);
    };
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Your Todo Checklist
        </h2>

        {todos.length === 0 ? (
          <p className="text-gray-500 text-center">No todos yet 👀</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((t) => (
              <li
                key={t._id}
                className="flex items-center gap-2 border p-2 rounded"
              >
                <input type="checkbox" checked={t.completed} readOnly />
                <span
                  className={`${
                    t.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {t.title}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Link
          to="/todos"
          className="block mt-4 text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Manage Todos
        </Link>
      </div>
    </div>
  );
}
