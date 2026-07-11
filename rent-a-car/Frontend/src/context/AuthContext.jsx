import { createContext, useMemo, useReducer } from 'react';

const initialState = {
  user: { role: 'admin', name: 'Dev User' },
  token: 'dummy-token',
  isAuthenticated: true,
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
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (payload) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload });
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
