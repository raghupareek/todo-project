import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import GlobalProviders from "./providers/GlobalProviders";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalProviders>
      <App />
    </GlobalProviders>
  </StrictMode>
);
