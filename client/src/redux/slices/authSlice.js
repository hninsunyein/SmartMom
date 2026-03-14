import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      if (response.token) apiService.setToken(response.token);
      if (response.refreshToken) apiService.setRefreshToken(response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await apiService.logoutApi();
    } catch {
      // ignore errors — always clear local state
    }
    apiService.removeToken();
    apiService.removeRefreshToken();
    dispatch(logout());
  }
);

export const registerParent = createAsyncThunk(
  'auth/registerParent',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.registerParent(userData);
      if (response.token) apiService.setToken(response.token);
      if (response.refreshToken) apiService.setRefreshToken(response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerAdvisor = createAsyncThunk(
  'auth/registerAdvisor',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.registerAdvisor(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isHydrating: true,   // true until the initial session check completes
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      apiService.removeToken();
      apiService.removeRefreshToken();
    },
    clearError: (state) => {
      state.error = null;
    },
    setHydrated: (state) => {
      state.isHydrating = false;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(registerParent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerParent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerParent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerAdvisor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAdvisor.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerAdvisor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isHydrating = false;
      })
      .addCase(getProfile.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isHydrating = false;
        apiService.removeToken();
        apiService.removeRefreshToken();
      });
  },
});

export const { logout, clearError, setCredentials, setHydrated } = authSlice.actions;
export default authSlice.reducer;
