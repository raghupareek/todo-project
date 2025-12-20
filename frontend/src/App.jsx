import { BrowserRouter, Routes, Route } from "react-router-dom";
import Todos from "./pages/Todos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Todos />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
