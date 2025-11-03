import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import cartReducer from './slices/cartSlice.ts';
import { setAuthToken } from '../services/axiosClient.ts';
import cartSyncMiddleware from './middleware/cartSyncMiddleware.ts';


const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  // Thêm các slice khác tại đây
});

export const store = configureStore({ 
  reducer: rootReducer,
  middleware: (getDefault) => getDefault().concat(cartSyncMiddleware),
});

store.subscribe(() => {
  const state = store.getState();
  const token = (state as RootState).auth.token || undefined;
  setAuthToken(token);
});

// Hydrate axios auth header from persisted state (if any)
try {
  const state = store.getState();
  const token = (state as RootState).auth.token || undefined;
  if (token) setAuthToken(token);
} catch {
  // ignore
}

// Type cho RootState và AppDispatch (xài với TypeScript)
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
