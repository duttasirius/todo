import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { todoApi } from "../services/api";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "../types";

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

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await todoApi.list();
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Could not load todos");
    }
  },
);

export const fetchTodo = createAsyncThunk(
  "todos/fetchTodo",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await todoApi.get(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Could not load todo");
    }
  },
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (payload: CreateTodoInput, { rejectWithValue }) => {
    try {
      const response = await todoApi.create(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Could not create todo");
    }
  },
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (
    payload: { id: string; data: UpdateTodoInput },
    { rejectWithValue },
  ) => {
    try {
      const response = await todoApi.update(payload.id, payload.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Could not update todo");
    }
  },
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: string, { rejectWithValue }) => {
    try {
      await todoApi.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Could not delete todo");
    }
  },
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    clearTodoError: (state) => {
      state.error = null;
    },
    clearSelectedTodo: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.items = action.payload as Todo[];
        state.loading = false;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Could not load todos";
      })
      .addCase(fetchTodo.pending, (state) => {
        state.detailLoading = true;
        state.selected = null;
        state.error = null;
      })
      .addCase(fetchTodo.fulfilled, (state, action) => {
        state.selected = action.payload as Todo;
        state.detailLoading = false;
      })
      .addCase(fetchTodo.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = (action.payload as string) || "Could not load todo";
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.unshift(action.payload as Todo);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.error = (action.payload as string) || "Could not create todo";
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const updated = action.payload as Todo;
        state.items = state.items.map((todo) =>
          todo._id === updated._id ? updated : todo,
        );
        if (state.selected?._id === updated._id) {
          state.selected = updated;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = (action.payload as string) || "Could not update todo";
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        const id = action.payload as string;
        state.items = state.items.filter((todo) => todo._id !== id);
        if (state.selected?._id === id) {
          state.selected = null;
        }
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = (action.payload as string) || "Could not delete todo";
      });
  },
});

export const { clearTodoError, clearSelectedTodo } = todoSlice.actions;
export default todoSlice.reducer;
