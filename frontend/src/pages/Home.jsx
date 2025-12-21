import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await api.get("/todolists");
      setLists(res.data);
    } finally {
      setLoading(false);
    }
  };

  const deleteList = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this checklist?\nAll todos will be removed."
    );
    if (!ok) return;

    await api.delete(`/todolists/${id}`);
    setLists((prev) => prev.filter((l) => l._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Your Todo Checklists
        </h2>

        {/* PRIMARY CTA CARD */}
        <Link
          to="/todos"
          className="block mb-6 border-2 border-dashed border-blue-400 rounded-lg p-6 text-center
                     hover:bg-blue-50 transition"
        >
          <div className="text-3xl mb-2">➕</div>
          <div className="font-semibold text-blue-600 text-lg">
            New Checklist
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Create a checklist for your tasks
          </p>
        </Link>

        {/* EMPTY STATE */}
        {!loading && lists.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="font-medium">No checklists yet</p>
            <p className="text-sm mt-1">
              Create your first checklist to get started
            </p>
          </div>
        )}

        {/* CHECKLIST PREVIEW CARDS */}
        {lists.length > 0 && (
          <ul className="space-y-3">
            {lists.map((list) => (
              <li
                key={list._id}
                className="border rounded-lg hover:shadow transition group"
              >
                {/* Entire card clickable */}
                <Link to={`/todos/${list._id}`} className="block p-4">
                  <div className="font-semibold text-lg text-gray-800">
                    {list.title}
                  </div>

                  <p className="text-sm text-gray-500 mt-1">Open checklist →</p>
                </Link>

                {/* Danger zone */}
                <div className="border-t px-4 py-2 flex justify-end">
                  <button
                    onClick={() => deleteList(list._id)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
