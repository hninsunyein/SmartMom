import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

export const fetchChildren = createAsyncThunk('children/fetchAll', async (_, { rejectWithValue }) => {
  try { return await apiService.getChildren(); }
  catch (e) { return rejectWithValue(e.message); }
});

export const addChild = createAsyncThunk('children/add', async (data, { rejectWithValue }) => {
  try { return await apiService.createChild(data); }
  catch (e) { return rejectWithValue(e.message); }
});

export const updateChild = createAsyncThunk('children/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await apiService.updateChild(id, data); }
  catch (e) { return rejectWithValue(e.message); }
});

export const deleteChild = createAsyncThunk('children/delete', async (id, { rejectWithValue }) => {
  try { await apiService.deleteChild(id); return id; }
  catch (e) { return rejectWithValue(e.message); }
});

const childrenSlice = createSlice({
  name: 'children',
  initialState: { list: [], isLoading: false, error: null },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChildren.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchChildren.fulfilled, (s, a) => { s.isLoading = false; s.list = a.payload.data || []; })
      .addCase(fetchChildren.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })
      .addCase(addChild.fulfilled, (s, a) => { s.list.push(a.payload.data); })
      .addCase(updateChild.fulfilled, (s, a) => {
        const idx = s.list.findIndex(c => c.id === a.payload.data.id);
        if (idx !== -1) s.list[idx] = a.payload.data;
      })
      .addCase(deleteChild.fulfilled, (s, a) => { s.list = s.list.filter(c => c.id !== a.payload); });
  },
});

export const { clearError } = childrenSlice.actions;
export default childrenSlice.reducer;
