import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { GripVertical } from "lucide-react";

export default function Todos() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [currentListId, setCurrentListId] = useState(listId || null);
  const [todos, setTodos] = useState([]);
  const [deletedTodos, setDeletedTodos] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | completed | trash

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");
  const [labels, setLabels] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // checklist title
  const [listTitle, setListTitle] = useState("");
  const [editingListTitle, setEditingListTitle] = useState(false);
  const [tempListTitle, setTempListTitle] = useState("");

  // todo editing
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editLabels, setEditLabels] = useState("");

  const [dragId, setDragId] = useState(null);

  const addInputRef = useRef(null);
  const editInputRef = useRef(null);
  const listTitleInputRef = useRef(null);

  const [dragOverId, setDragOverId] = useState(null);

  const fetchList = async () => {
    const res = await api.get(`/todolists/${currentListId}`);
    setListTitle(res.data.title);
    setTempListTitle(res.data.title);
  };

  const fetchTodos = async () => {
    const res = await api.get(`/todos?list=${currentListId}`);
    setTodos(res.data);
  };

  const fetchDeletedTodos = async () => {
    const res = await api.get("/todos/deleted");
    setDeletedTodos(res.data);
  };

  useEffect(() => {
    if (currentListId) {
      fetchTodos();
      fetchList();
    }
  }, [currentListId]);

  useEffect(() => {
    if (filter === "trash") {
      fetchDeletedTodos();
    }
  }, [filter]);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    if (editingListTitle) listTitleInputRef.current?.focus();
  }, [editingListTitle]);

  const createChecklistIfNeeded = async () => {
    if (!listTitle.trim()) return;
    const res = await api.post("/todolists", { title: listTitle });
    setCurrentListId(res.data._id);
    navigate(`/todos/${res.data._id}`, { replace: true });
  };

  const updateListTitle = async () => {
    if (!tempListTitle.trim()) return;
    setIsSaving(true);
    const res = await api.put(`/todolists/${currentListId}`, {
      title: tempListTitle,
    });
    setListTitle(res.data.title);
    setEditingListTitle(false);
    setIsSaving(false);
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    setIsSaving(true);

    const todoData = {
      title,
      list: currentListId,
      dueDate: dueDate || undefined,
      priority,
      notes: notes || undefined,
      labels: labels
        ? labels
            .split(",")
            .map((l) => l.trim())
            .filter((l) => l)
        : [],
    };

    const res = await api.post("/todos", todoData);

    setTodos((prev) => [...prev, res.data]);
    setTitle("");
    setDueDate("");
    setPriority("");
    setNotes("");
    setLabels("");
    setIsSaving(false);
    addInputRef.current?.focus();
  };

  const restoreTodo = async (id) => {
    await api.put(`/todos/${id}/restore`);
    setDeletedTodos((prev) => prev.filter((t) => t._id !== id));
    if (filter !== "trash") {
      fetchTodos(); // Refresh active todos
    }
  };

  const toggleComplete = async (todo) => {
    const res = await api.put(`/todos/${todo._id}`, {
      completed: !todo.completed,
    });
    setTodos((prev) => prev.map((t) => (t._id === todo._id ? res.data : t)));
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    setIsSaving(true);

    const updateData = {
      title: editTitle,
      dueDate: editDueDate || undefined,
      priority: editPriority,
      notes: editNotes || undefined,
      labels: editLabels
        ? editLabels
            .split(",")
            .map((l) => l.trim())
            .filter((l) => l)
        : [],
    };

    const res = await api.put(`/todos/${id}`, updateData);
    setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));

    setEditingId(null);
    setIsSaving(false);
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDueDate(
      todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : ""
    );
    setEditPriority(todo.priority || "");
    setEditNotes(todo.notes || "");
    setEditLabels(todo.labels ? todo.labels.join(", ") : "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDueDate("");
    setEditPriority("");
    setEditNotes("");
    setEditLabels("");
  };

  /* =====================
     PROGRESS INDICATOR
  ====================== */
  const activeTodos = todos.filter((t) => !t.deleted);
  const completedCount = activeTodos.filter((t) => t.completed).length;
  const progress =
    activeTodos.length === 0
      ? 0
      : Math.round((completedCount / activeTodos.length) * 100);

  /* =====================
     FILTER LOGIC
  ====================== */
  const getFilteredTodos = () => {
    if (filter === "trash") return deletedTodos;
    return todos.filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    });
  };

  const filteredTodos = getFilteredTodos();

  /* =====================
     DRAG & DROP
  ====================== */
  const handleDragStart = (id) => {
    setDragId(id);
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id !== dragId) setDragOverId(id);
  };

  const handleDrop = async (targetId) => {
    if (!dragId || dragId === targetId) return;

    const updated = [...todos];
    const from = updated.findIndex((t) => t._id === dragId);
    const to = updated.findIndex((t) => t._id === targetId);

    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);

    setTodos(updated);

    // Update order on server
    const todoIds = updated.map((t) => t._id);
    try {
      await api.post("/todos/reorder", { listId: currentListId, todoIds });
    } catch (error) {
      console.error("Failed to reorder todos:", error);
      // Revert on error
      fetchTodos();
    }

    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link
            to="/home"
            className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
          >
            Home
          </Link>
          {listTitle && <> / {listTitle}</>}
        </div>

        {!currentListId ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Create New Checklist
            </h2>

            <div className="flex gap-2">
              <input
                className="border p-2 flex-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Checklist title..."
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && createChecklistIfNeeded()
                }
              />
              <button
                onClick={createChecklistIfNeeded}
                disabled={!listTitle.trim()}
                className="bg-blue-500 disabled:opacity-50 text-white px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-400"
              >
                Create
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Editable checklist title */}
            <div className="flex justify-center items-center gap-2 mb-3">
              {editingListTitle ? (
                <>
                  <input
                    ref={listTitleInputRef}
                    className="border p-2 rounded flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    value={tempListTitle}
                    onChange={(e) => setTempListTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateListTitle();
                      if (e.key === "Escape") setEditingListTitle(false);
                    }}
                  />
                  <button
                    disabled={isSaving}
                    onClick={updateListTitle}
                    className="text-green-600 text-sm"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{listTitle}</h2>
                  <button
                    onClick={() => setEditingListTitle(true)}
                    className="text-blue-500 dark:text-blue-400 text-sm hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-1">
                {completedCount} / {activeTodos.length} completed
              </p>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded">
                <div
                  className="h-2 bg-blue-500 dark:bg-blue-400 rounded transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex justify-center gap-2 mb-3">
              {["all", "active", "completed", "trash"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-sm px-3 py-1 rounded ${
                    filter === f
                      ? "bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {filter !== "trash" && (
              <>
                {/* Sticky Add Todo */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 pt-2 pb-3 z-10 border-b dark:border-gray-700 mb-4">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        ref={addInputRef}
                        className="border p-2 flex-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="New todo..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()}
                      />
                      <button
                        onClick={addTodo}
                        disabled={!title.trim() || isSaving}
                        className="bg-blue-500 disabled:opacity-50 text-white px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-400"
                      >
                        {isSaving ? "Saving..." : "Add"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <input
                        type="date"
                        className="border p-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        placeholder="Due date"
                      />
                      <select
                        className="border p-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="">--select priority--</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <textarea
                      className="border p-1 rounded w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      placeholder="Notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="2"
                    />

                    <input
                      className="border p-1 rounded w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      placeholder="Labels (comma separated)..."
                      value={labels}
                      onChange={(e) => setLabels(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {filteredTodos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center mt-6">
                🎯 This checklist is empty
                <br /> Add your first task above
              </p>
            ) : (
              <ul className="space-y-2 mt-4">
                {filteredTodos.map((t) => (
                  <li
                    key={t._id}
                    onDragOver={(e) =>
                      filter !== "trash" && handleDragOver(e, t._id)
                    }
                    onDrop={() => filter !== "trash" && handleDrop(t._id)}
                    className={`flex items-center gap-2 p-2 rounded transition-all
    ${
      filter !== "trash" && dragOverId === t._id && dragId !== t._id
        ? "border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-900/20"
        : t.completed
        ? "bg-gray-100 dark:bg-gray-700 opacity-70"
        : "border hover:bg-gray-50 dark:hover:bg-gray-700"
    }
    ${
      filter !== "trash" && dragId === t._id
        ? "scale-[1.02] shadow-md bg-white dark:bg-gray-800"
        : ""
    }`}
                  >
                    {/* Drag handle with GripVertical icon */}
                    {filter !== "trash" && (
                      <div
                        draggable
                        onDragStart={() => setDragId(t._id)}
                        className="cursor-move p-1 text-gray-400 select-none"
                        title="Drag to reorder"
                      >
                        <GripVertical size={18} />
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleComplete(t)}
                      />

                      {editingId === t._id ? (
                        <div className="flex-1 space-y-2">
                          <input
                            ref={editInputRef}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(t._id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="border p-1 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                          />
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <input
                              type="date"
                              className="border p-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              value={editDueDate}
                              onChange={(e) => setEditDueDate(e.target.value)}
                            />
                            <select
                              className="border p-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              value={editPriority}
                              onChange={(e) => setEditPriority(e.target.value)}
                            >
                              <option value="">--select priority--</option>
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          <textarea
                            className="border p-1 rounded w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="Notes..."
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            rows="2"
                          />
                          <input
                            className="border p-1 rounded w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="Labels..."
                            value={editLabels}
                            onChange={(e) => setEditLabels(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(t._id)}
                              disabled={isSaving}
                              className="text-green-600 dark:text-green-400 text-sm hover:text-green-700 dark:hover:text-green-300"
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-600 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`flex-1 ${
                            filter !== "trash" ? "cursor-pointer" : ""
                          }`}
                          onClick={() => filter !== "trash" && startEdit(t)}
                        >
                          <div
                            className={`font-medium ${
                              t.completed
                                ? "line-through text-gray-400 dark:text-gray-500"
                                : ""
                            }`}
                          >
                            {t.title}
                          </div>
                          {t.dueDate && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Due: {new Date(t.dueDate).toLocaleDateString()}
                            </div>
                          )}
                          {t.priority && (
                            <div
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                t.priority === "high"
                                  ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                                  : t.priority === "low"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                              }`}
                            >
                              {t.priority === "high" && "🔴 "}
                              {t.priority === "low" && "🟢 "}
                              {t.priority === "medium" && "🟡 "}
                              {t.priority.toUpperCase()}
                            </div>
                          )}
                          {t.notes && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-xs truncate">
                              {t.notes}
                            </div>
                          )}
                          {t.labels && t.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {t.labels.map((label, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1 rounded"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        filter === "trash"
                          ? restoreTodo(t._id)
                          : deleteTodo(t._id)
                      }
                      className="text-red-500 dark:text-red-400 text-sm hover:text-red-600 dark:hover:text-red-300"
                    >
                      {filter === "trash" ? "Restore" : "Trash"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
