import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useThemeStore } from "../stores/themeStore";
import {
  Home,
  CheckSquare,
  Trash2,
  LogOut,
  Menu,
  X,
  Palette,
  Lightbulb,
  CloudMoon,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Subscribe to Zustand store so component re-renders when theme changes
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Lightbulb },
    { value: "dark", label: "Dark", icon: CloudMoon },
    { value: "system", label: "Auto", icon: Settings },
  ];

  const navigationItems = [
    { to: "/home", label: "Home", icon: Home },
    { to: "/todos", label: "Todos", icon: CheckSquare },
    { to: "/trash", label: "Trash", icon: Trash2 },
  ];

  const isActive = (path) => {
    if (path === "/todos" && location.pathname.startsWith("/todos"))
      return true;
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-16" : "w-64"}
          md:translate-x-0 md:static md:inset-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div
            className={`flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
          >
            {!isCollapsed ? (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Todo App
              </h1>
            ) : (
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                📝
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block ml-auto p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200 border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav
            className={`flex-1 py-6 space-y-2 ${isCollapsed ? "px-2" : "px-4"}`}
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isCollapsed ? "justify-center" : "px-4"}
                    ${
                      isActive(item.to)
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <Icon size={18} className={isCollapsed ? "" : "mr-3"} />
                  {!isCollapsed && item.label}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          {!isCollapsed && (
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Theme
                  </p>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        resolvedTheme === "dark"
                          ? "bg-blue-500"
                          : resolvedTheme === "light"
                          ? "bg-yellow-400"
                          : "bg-purple-500"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                      {resolvedTheme}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActiveOption =
                      option.value === "system"
                        ? theme === "system"
                        : resolvedTheme === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`
                          flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200
                          ${
                            isActiveOption
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 hover:shadow-sm"
                          }
                        `}
                      >
                        <Icon size={16} className="mb-1" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* User Actions */}
          <div
            className={`px-4 py-4 border-t border-gray-200 dark:border-gray-700 ${
              isCollapsed ? "px-2" : ""
            }`}
          >
            <button
              onClick={handleLogout}
              className={`flex items-center w-full py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 ${
                isCollapsed ? "justify-center" : "px-4"
              }`}
            >
              <LogOut size={18} className={isCollapsed ? "" : "mr-3"} />
              {!isCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
