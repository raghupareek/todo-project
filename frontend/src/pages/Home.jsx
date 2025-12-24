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

  const moveToTrash = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to move this checklist to trash?\nAll todos will be moved to trash as well."
    );
    if (!ok) return;

    try {
      await api.delete(`/todolists/${id}`);
      setLists((prev) => prev.filter((l) => l._id !== id));
      alert("Checklist moved to trash successfully!");
    } catch (error) {
      console.error("Error moving to trash:", error);
      alert("Failed to move checklist to trash. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div
        className="bg-white dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700
                      rounded-lg shadow p-6"
      >
        <h2
          className="text-2xl font-semibold mb-6 text-center
                       text-gray-900 dark:text-white"
        >
          Your Todo Checklists
        </h2>

        {/* Trash link */}
        <div className="text-center mb-6">
          <Link
            to="/trash"
            className="text-sm font-medium
                       text-gray-600 hover:text-gray-800
                       dark:text-gray-400 dark:hover:text-gray-300"
          >
            🗑 View Trash
          </Link>
        </div>

        {/* PRIMARY CTA CARD */}
        <Link
          to="/todos"
          className="block mb-6 rounded-lg p-6 text-center
                     border-2 border-dashed
                     border-blue-500 dark:border-blue-400
                     bg-blue-50 dark:bg-transparent
                     hover:bg-blue-100 dark:hover:bg-blue-900/20
                     transition-colors"
        >
          <div className="text-3xl mb-2">➕</div>
          <div className="font-semibold text-blue-700 dark:text-blue-400 text-lg">
            New Checklist
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create a checklist for your tasks
          </p>
        </Link>

        {/* EMPTY STATE */}
        {!loading && lists.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="font-medium">No checklists yet</p>
            <p className="text-sm mt-1">
              Create your first checklist to get started
            </p>
          </div>
        )}

        {/* CHECKLIST PREVIEW CARDS */}
        {lists.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <div
                key={list._id}
                className="rounded-lg transition-shadow group
                           bg-white dark:bg-gray-800
                           border border-gray-300 dark:border-gray-700
                           hover:shadow-lg dark:hover:shadow-xl"
              >
                {/* Entire card clickable */}
                <Link to={`/todos/${list._id}`} className="block p-4">
                  <div
                    className="font-semibold text-lg
                                  text-gray-800 dark:text-white"
                  >
                    {list.title}
                  </div>

                  {list.stats && (
                    <div
                      className="flex items-center gap-4 mt-2 text-sm
                                    text-gray-600 dark:text-gray-400"
                    >
                      <span>
                        {list.stats.completed}/{list.stats.total} completed
                      </span>
                      {list.stats.upcomingDue > 0 && (
                        <span className="text-orange-600 dark:text-orange-400">
                          📅 {list.stats.upcomingDue} due
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Open checklist →
                  </p>
                </Link>

                {/* Danger zone */}
                <div
                  className="border-t border-gray-200 dark:border-gray-700
                                px-4 py-2 flex justify-end"
                >
                  <button
                    onClick={() => moveToTrash(list._id)}
                    className="text-sm font-medium
                               text-orange-600 hover:text-orange-800
                               dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    🗑 Move to Trash
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
