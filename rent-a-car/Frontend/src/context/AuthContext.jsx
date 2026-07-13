import { createContext, useMemo, useReducer } from 'react';
import axiosClient from '../api/axiosClient';

const STORAGE_KEY = 'authSession';

function readStoredSession() {
  if (typeof window === 'undefined') {
    return { user: null };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
      || window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      user: parsed?.user || null,
    };
  } catch {
    return { user: null };
  }
}

const storedSession = readStoredSession();

const initialState = {
  user: storedSession.user || null,
  isAuthenticated: Boolean(storedSession.user),
};

const AuthContext = createContext(null);

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user || null,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (payload) => {
    if (typeof window !== 'undefined') {
      const storage = payload.rememberMe ? window.localStorage : window.sessionStorage;
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
      storage.setItem(STORAGE_KEY, JSON.stringify({ user: payload.user }));
    }
    dispatch({ type: 'LOGIN_SUCCESS', payload });
  };

  const logout = () => {
    axiosClient.post('/auth/logout').catch(() => {});
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authSession');
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user) => {
    if (typeof window !== 'undefined') {
      const storage = window.localStorage.getItem(STORAGE_KEY)
        ? window.localStorage
        : window.sessionStorage;
      storage.setItem(STORAGE_KEY, JSON.stringify({ user }));
    }
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      updateUser,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
