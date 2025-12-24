import ThemeProvider from "./ThemeProvider";
import { AuthProvider } from "../context/AuthContext";

export default function GlobalProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
