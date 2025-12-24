import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Trash() {
  const [deletedLists, setDeletedLists] = useState([]);
  const [deletedTodos, setDeletedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLists, setSelectedLists] = useState(new Set());
  const [selectedTodos, setSelectedTodos] = useState(new Set());

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      setError(null);
      const [listsRes, todosRes] = await Promise.all([
        api.get("/todolists/deleted"),
        api.get("/todos/deleted"),
      ]);
      setDeletedLists(listsRes.data);
      setDeletedTodos(todosRes.data);
    } catch (err) {
      console.error("Error fetching trash:", err);
      setError("Failed to load trash items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const restoreList = async (id) => {
    await api.put(`/todolists/${id}/restore`);
    fetchTrash();
  };

  const restoreTodo = async (id) => {
    await api.put(`/todos/${id}/restore`);
    fetchTrash();
  };

  const permanentDeleteList = async (id) => {
    if (!window.confirm("Permanently delete this checklist and all its todos?"))
      return;
    await api.delete(`/todolists/${id}/permanent`);
    fetchTrash();
  };

  const permanentDeleteTodo = async (id) => {
    if (!window.confirm("Permanently delete this todo?")) return;
    await api.delete(`/todos/${id}/permanent`);
    fetchTrash();
  };

  const toggleListSelection = (id) => {
    setSelectedLists((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleTodoSelection = (id) => {
    setSelectedTodos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllLists = () => {
    setSelectedLists(new Set(deletedLists.map((list) => list._id)));
  };

  const selectAllTodos = () => {
    setSelectedTodos(new Set(deletedTodos.map((todo) => todo._id)));
  };

  const clearListSelection = () => {
    setSelectedLists(new Set());
  };

  const clearTodoSelection = () => {
    setSelectedTodos(new Set());
  };

  const deleteSelectedLists = async () => {
    if (selectedLists.size === 0) return;
    if (
      !window.confirm(
        `Permanently delete ${selectedLists.size} selected checklist(s) and all their todos?`
      )
    )
      return;

    try {
      await Promise.all(
        Array.from(selectedLists).map((id) =>
          api.delete(`/todolists/${id}/permanent`)
        )
      );
      setSelectedLists(new Set());
      fetchTrash();
      alert("Selected checklists deleted permanently.");
    } catch (err) {
      console.error("Error deleting selected lists:", err);
      alert("Failed to delete some checklists. Please try again.");
    }
  };

  const deleteSelectedTodos = async () => {
    if (selectedTodos.size === 0) return;
    if (
      !window.confirm(
        `Permanently delete ${selectedTodos.size} selected todo(s)?`
      )
    )
      return;

    try {
      await Promise.all(
        Array.from(selectedTodos).map((id) =>
          api.delete(`/todos/${id}/permanent`)
        )
      );
      setSelectedTodos(new Set());
      fetchTrash();
      alert("Selected todos deleted permanently.");
    } catch (err) {
      console.error("Error deleting selected todos:", err);
      alert("Failed to delete some todos. Please try again.");
    }
  };

  const deleteAll = async () => {
    const totalItems = deletedLists.length + deletedTodos.length;
    if (totalItems === 0) return;
    if (
      !window.confirm(
        `Permanently delete all ${totalItems} items in trash? This action cannot be undone.`
      )
    )
      return;

    try {
      await Promise.all([
        ...deletedLists.map((list) =>
          api.delete(`/todolists/${list._id}/permanent`)
        ),
        ...deletedTodos.map((todo) =>
          api.delete(`/todos/${todo._id}/permanent`)
        ),
      ]);
      setSelectedLists(new Set());
      setSelectedTodos(new Set());
      fetchTrash();
      alert("All items in trash deleted permanently.");
    } catch (err) {
      console.error("Error deleting all items:", err);
      alert("Failed to delete all items. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Trash
          </h2>
          <div className="flex gap-2">
            {(deletedLists.length > 0 || deletedTodos.length > 0) && (
              <button
                onClick={deleteAll}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Delete All ({deletedLists.length + deletedTodos.length})
              </button>
            )}
            <Link
              to="/home"
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-900 dark:text-white">Loading...</p>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400">
            <p>{error}</p>
            <button
              onClick={fetchTrash}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Deleted Checklists */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Deleted Checklists ({deletedLists.length})
                </h3>
                {deletedLists.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllLists}
                      className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearListSelection}
                      className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Clear
                    </button>
                    {selectedLists.size > 0 && (
                      <button
                        onClick={deleteSelectedLists}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete Selected ({selectedLists.size})
                      </button>
                    )}
                  </div>
                )}
              </div>
              {deletedLists.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No deleted checklists
                </p>
              ) : (
                <ul className="space-y-2">
                  {deletedLists.map((list) => (
                    <li
                      key={list._id}
                      className="border dark:border-gray-600 rounded p-3 flex items-center bg-gray-50 dark:bg-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLists.has(list._id)}
                        onChange={() => toggleListSelection(list._id)}
                        className="mr-3"
                      />
                      <span className="flex-1 text-gray-900 dark:text-white">
                        {list.title}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => restoreList(list._id)}
                          className="text-green-500 dark:text-green-400 text-sm hover:text-green-600 dark:hover:text-green-300"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => permanentDeleteList(list._id)}
                          className="text-red-500 dark:text-red-400 text-sm hover:text-red-600 dark:hover:text-red-300"
                        >
                          Delete Forever
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Deleted Todos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Deleted Todos ({deletedTodos.length})
                </h3>
                {deletedTodos.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllTodos}
                      className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearTodoSelection}
                      className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Clear
                    </button>
                    {selectedTodos.size > 0 && (
                      <button
                        onClick={deleteSelectedTodos}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete Selected ({selectedTodos.size})
                      </button>
                    )}
                  </div>
                )}
              </div>
              {deletedTodos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No deleted todos
                </p>
              ) : (
                <ul className="space-y-2">
                  {deletedTodos.map((todo) => (
                    <li
                      key={todo._id}
                      className="border dark:border-gray-600 rounded p-3 flex items-center bg-gray-50 dark:bg-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTodos.has(todo._id)}
                        onChange={() => toggleTodoSelection(todo._id)}
                        className="mr-3"
                      />
                      <span
                        className={`flex-1 text-gray-900 dark:text-white ${
                          todo.completed ? "line-through" : ""
                        }`}
                      >
                        {todo.title}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => restoreTodo(todo._id)}
                          className="text-green-500 dark:text-green-400 text-sm hover:text-green-600 dark:hover:text-green-300"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => permanentDeleteTodo(todo._id)}
                          className="text-red-500 dark:text-red-400 text-sm hover:text-red-600 dark:hover:text-red-300"
                        >
                          Delete Forever
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
