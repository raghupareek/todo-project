import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { GripVertical } from "lucide-react";

export default function Todos() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [currentListId, setCurrentListId] = useState(listId || null);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | completed

  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // checklist title
  const [listTitle, setListTitle] = useState("");
  const [editingListTitle, setEditingListTitle] = useState(false);
  const [tempListTitle, setTempListTitle] = useState("");

  // todo editing
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [dragId, setDragId] = useState(null);

  const addInputRef = useRef(null);
  const editInputRef = useRef(null);
  const listTitleInputRef = useRef(null);

  const [dragOverId, setDragOverId] = useState(null);

  useEffect(() => {
    if (currentListId) {
      fetchTodos();
      fetchList();
    }
  }, [currentListId]);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    if (editingListTitle) listTitleInputRef.current?.focus();
  }, [editingListTitle]);

  const fetchList = async () => {
    const res = await api.get(`/todolists/${currentListId}`);
    setListTitle(res.data.title);
    setTempListTitle(res.data.title);
  };

  const fetchTodos = async () => {
    const res = await api.get(`/todos?list=${currentListId}`);
    setTodos(res.data);
  };

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

    const res = await api.post("/todos", {
      title,
      list: currentListId,
    });

    setTodos((prev) => [...prev, res.data]);
    setTitle("");
    setIsSaving(false);
    addInputRef.current?.focus();
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("Delete this todo?")) return;
    await api.delete(`/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t._id !== id));
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

    const res = await api.put(`/todos/${id}`, { title: editTitle });
    setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));

    setEditingId(null);
    setIsSaving(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  /* =====================
     PROGRESS INDICATOR
  ====================== */
  const completedCount = todos.filter((t) => t.completed).length;
  const progress =
    todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  /* =====================
     FILTER LOGIC
  ====================== */
  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

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

  const handleDrop = (targetId) => {
    if (!dragId || dragId === targetId) return;

    const updated = [...todos];
    const from = updated.findIndex((t) => t._id === dragId);
    const to = updated.findIndex((t) => t._id === targetId);

    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);

    setTodos(updated);
    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded shadow p-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-2">
          <Link to="/home" className="text-blue-500">
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
                className="border p-2 flex-1 rounded"
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
                className="bg-blue-500 disabled:opacity-50 text-white px-4 rounded"
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
                    className="border p-2 rounded flex-1"
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
                    className="text-blue-500 text-sm"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="mb-3">
              <p className="text-sm text-gray-500 text-center mb-1">
                {completedCount} / {todos.length} completed
              </p>
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-500 rounded transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex justify-center gap-2 mb-3">
              {["all", "active", "completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-sm px-3 py-1 rounded ${
                    filter === f
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sticky Add Todo */}
            <div className="sticky top-0 bg-white pt-2 pb-3 z-10">
              <div className="flex gap-2">
                <input
                  ref={addInputRef}
                  className="border p-2 flex-1 rounded"
                  placeholder="New todo..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                />
                <button
                  onClick={addTodo}
                  disabled={!title.trim() || isSaving}
                  className="bg-blue-500 disabled:opacity-50 text-white px-4 rounded"
                >
                  {isSaving ? "Saving..." : "Add"}
                </button>
              </div>
            </div>

            {filteredTodos.length === 0 ? (
              <p className="text-gray-500 text-center mt-6">
                🎯 This checklist is empty
                <br /> Add your first task above
              </p>
            ) : (
              <ul className="space-y-2 mt-4">
                {filteredTodos.map((t) => (
                  <li
                    key={t._id}
                    onDragOver={(e) => handleDragOver(e, t._id)}
                    onDrop={() => handleDrop(t._id)}
                    className={`flex items-center gap-2 p-2 rounded transition-all
    ${
      dragOverId === t._id && dragId !== t._id
        ? "border-2 border-dashed border-blue-400 bg-blue-50"
        : t.completed
        ? "bg-gray-100 opacity-70"
        : "border hover:bg-gray-50"
    }
    ${dragId === t._id ? "scale-[1.02] shadow-md bg-white" : ""}`}
                  >
                    {/* Drag handle with GripVertical icon */}
                    <div
                      draggable
                      onDragStart={() => setDragId(t._id)}
                      className="cursor-move p-1 text-gray-400 select-none"
                      title="Drag to reorder"
                    >
                      <GripVertical size={18} />
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleComplete(t)}
                      />

                      {editingId === t._id ? (
                        <input
                          ref={editInputRef}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(t._id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="border p-1 rounded flex-1"
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setEditingId(t._id);
                            setEditTitle(t.title);
                          }}
                          className={`cursor-pointer flex-1 ${
                            t.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {t.title}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => deleteTodo(t._id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
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
