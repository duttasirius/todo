import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TodoDetails from "./pages/TodoDetails";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TodoDetails />
  </StrictMode>,
);
