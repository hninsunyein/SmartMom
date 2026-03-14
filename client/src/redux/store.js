import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import childrenSlice from './slices/childrenSlice';
import appointmentsSlice from './slices/appointmentsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    children: childrenSlice,
    appointments: appointmentsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
