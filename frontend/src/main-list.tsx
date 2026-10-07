import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import TodoList from "./pages/TodoList";
import { store } from "./store/store";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <TodoList />
    </Provider>
  </StrictMode>,
);
