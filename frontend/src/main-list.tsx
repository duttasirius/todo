import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TodoList from "./pages/TodoList";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TodoList />
  </StrictMode>,
);
