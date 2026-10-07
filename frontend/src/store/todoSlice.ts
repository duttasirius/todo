import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Todo } from "../types";

interface TodoState {
  items: Todo[];
  selected: Todo | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  items: [],
  selected: null,
  loading: false,
  detailLoading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodosLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDetailLoading: (state, action: PayloadAction<boolean>) => {
      state.detailLoading = action.payload;
    },
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedTodo: (state, action: PayloadAction<Todo | null>) => {
      state.selected = action.payload;
      state.detailLoading = false;
      state.error = null;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.unshift(action.payload);
      state.error = null;
    },
    replaceTodo: (state, action: PayloadAction<Todo>) => {
      const updated = action.payload;
      state.items = state.items.map((todo) =>
        todo._id === updated._id ? updated : todo,
      );

      if (state.selected?._id === updated._id) {
        state.selected = updated;
      }

      state.error = null;
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((todo) => todo._id !== action.payload);

      if (state.selected?._id === action.payload) {
        state.selected = null;
      }

      state.error = null;
    },
    setTodoError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      state.detailLoading = false;
    },
    clearTodoError: (state) => {
      state.error = null;
    },
    clearSelectedTodo: (state) => {
      state.selected = null;
    },
  },
});

export const {
  setTodosLoading,
  setDetailLoading,
  setTodos,
  setSelectedTodo,
  addTodo,
  replaceTodo,
  removeTodo,
  setTodoError,
  clearTodoError,
  clearSelectedTodo,
} = todoSlice.actions;

export default todoSlice.reducer;
