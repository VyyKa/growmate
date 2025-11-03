import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/interfaces/model/User';
import type { RootState } from '../store';
import { getTimePeriodInSeconds } from '../../utils/helpers/timeHelpers';
import { USER_TIME_EXPIRATION_HOUR, USER_REMEMBER_EXPIRATION_DAYS } from '../../utils/constants/globalConstants';
import { loadFromLocalStorage, saveToLocalStorage } from '../localStorage';

interface AuthState {
  user: User | null;
  token: string | null;
}

// LocalStorage helpers (auth-specific)
const AUTH_KEY = "auth"

const initialState: AuthState = ((): AuthState => {
  const loaded = loadFromLocalStorage<AuthState>(AUTH_KEY, { checkExpiryField: "expiresAt" });
  if (loaded && typeof loaded === 'object') {
    return {
      user: (loaded as AuthState).user ?? null,
      token: (loaded as AuthState).token ?? null,
    };
  }
  return { user: null, token: null };
})();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      const defaultMs = getTimePeriodInSeconds(0, 0, USER_TIME_EXPIRATION_HOUR, 0) * 1000;
      saveToLocalStorage("auth", state, { expiresInMs: defaultMs });
    },
    setCredentials(state, action: PayloadAction<{ user: User; token: string; rememberMe?: boolean }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      const remember = !!action.payload.rememberMe;
      const expiresInMs = remember
        ? getTimePeriodInSeconds(0, 0, 0, USER_REMEMBER_EXPIRATION_DAYS) * 1000
        : getTimePeriodInSeconds(0, 0, USER_TIME_EXPIRATION_HOUR, 0) * 1000;
      saveToLocalStorage(AUTH_KEY, state, { expiresInMs });
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem(AUTH_KEY);
    },
  },
});


export const selectIsLoggedIn = (state: RootState) => !!state.auth.user && !!state.auth.token;

export const { setUser, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
