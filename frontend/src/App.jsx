import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Todos from "./pages/Todos";
import Trash from "./pages/Trash";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Sidebar />}>
            <Route path="/home" element={<Home />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/todos/:listId" element={<Todos />} />
            <Route path="/trash" element={<Trash />} />
          </Route>
        </Route>

        {/* Default */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
