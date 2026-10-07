import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../services/api";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
  error: null,
};

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.me();
      return response.data;
    } catch {
      return rejectWithValue("Not authenticated");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authApi.register(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    payload: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authApi.login(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Login failed");
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Logout failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload as User;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload as User;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Registration failed";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload as User;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = (action.payload as string) || "Logout failed";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
