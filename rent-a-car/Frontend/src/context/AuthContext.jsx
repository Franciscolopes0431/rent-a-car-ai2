import { createContext, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'authSession';

function readStoredSession() {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      user: parsed?.user || null,
      token: parsed?.token || null,
    };
  } catch {
    return { user: null, token: null };
  }
}

const storedSession = readStoredSession();

const initialState = {
  user: storedSession.user || null,
  token: storedSession.token || null,
  isAuthenticated: Boolean(storedSession.token),
};

const AuthContext = createContext(null);

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user || null,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
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
      window.localStorage.setItem('authSession', JSON.stringify(payload));
    }
    dispatch({ type: 'LOGIN_SUCCESS', payload });
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authSession');
    }
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user) => {
    if (typeof window !== 'undefined') {
      const current = readStoredSession();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: current.token, user }));
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
