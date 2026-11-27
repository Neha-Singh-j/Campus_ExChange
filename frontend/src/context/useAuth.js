import { createContext, useContext } from 'react';

// Kept separate from AuthContext.jsx so that file only exports a component
// (required by react-refresh/only-export-components).
export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
