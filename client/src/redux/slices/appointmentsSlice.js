import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

export const fetchAppointments = createAsyncThunk('appointments/fetchAll', async (_, { rejectWithValue }) => {
  try { return await apiService.getAppointments(); }
  catch (e) { return rejectWithValue(e.message); }
});

export const bookAppointment = createAsyncThunk('appointments/book', async (data, { rejectWithValue }) => {
  try { return await apiService.createAppointment(data); }
  catch (e) { return rejectWithValue(e.message); }
});

export const approveAppointment = createAsyncThunk('appointments/approve', async (id, { rejectWithValue }) => {
  try { return await apiService.approveAppointment(id); }
  catch (e) { return rejectWithValue(e.message); }
});

export const rejectAppointment = createAsyncThunk('appointments/reject', async (id, { rejectWithValue }) => {
  try { return await apiService.rejectAppointment(id); }
  catch (e) { return rejectWithValue(e.message); }
});

export const cancelAppointment = createAsyncThunk('appointments/cancel', async (id, { rejectWithValue }) => {
  try { return await apiService.cancelAppointment(id); }
  catch (e) { return rejectWithValue(e.message); }
});

export const saveAppointmentNotes = createAsyncThunk('appointments/saveNotes', async ({ id, notes }, { rejectWithValue }) => {
  try { return await apiService.updateAppointmentNotes(id, notes); }
  catch (e) { return rejectWithValue(e.message); }
});

const updateInList = (list, payload) => {
  const idx = list.findIndex(x => x.id === payload.data.id);
  if (idx !== -1) list[idx] = { ...list[idx], ...payload.data };
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: { list: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending,   (s) => { s.isLoading = true; })
      .addCase(fetchAppointments.fulfilled, (s, a) => { s.isLoading = false; s.list = a.payload.data || []; })
      .addCase(fetchAppointments.rejected,  (s, a) => { s.isLoading = false; s.error = a.payload; })
      .addCase(bookAppointment.fulfilled,   (s, a) => { s.list.unshift(a.payload.data); })
      .addCase(approveAppointment.fulfilled,(s, a) => { updateInList(s.list, a.payload); })
      .addCase(rejectAppointment.fulfilled, (s, a) => { updateInList(s.list, a.payload); })
      .addCase(cancelAppointment.fulfilled, (s, a) => { updateInList(s.list, a.payload); })
      .addCase(saveAppointmentNotes.fulfilled, (s, a) => { updateInList(s.list, a.payload); });
  },
});

export default appointmentsSlice.reducer;
