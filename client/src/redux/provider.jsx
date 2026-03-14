'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import apiService from '../services/api';
import { getProfile, logout, setHydrated } from './slices/authSlice';

function AuthHydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear any legacy localStorage tokens from old versions
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    const token = apiService.getToken(); // reads from sessionStorage
    if (token) {
      dispatch(getProfile()); // isHydrating → false when this resolves
    } else {
      dispatch(setHydrated()); // no session — mark hydration done immediately
    }

    // Fired by api.js when refresh token is expired/invalid
    const handleForceLogout = () => dispatch(logout());
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [dispatch]);

  return null;
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  );
}
