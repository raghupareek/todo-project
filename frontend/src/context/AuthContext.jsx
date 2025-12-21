import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token ONCE on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
