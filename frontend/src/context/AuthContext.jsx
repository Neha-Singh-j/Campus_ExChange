import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { setSessionExpiredHandler, tokenStore } from '../services/api';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(tokenStore.get()));

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  // Restore the session from a saved token when the app opens.
  useEffect(() => {
    setSessionExpiredHandler(logout);
    if (!tokenStore.get()) return undefined;

    let active = true;
    api
      .me()
      .then((res) => active && setUser(res.user))
      .catch((err) => {
        // Only a rejected token logs out; a network blip keeps the saved session.
        if (active && err.status === 401) logout();
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [logout]);

  /** Call with the { token, user } returned by login / register. */
  const completeLogin = useCallback(({ token, user: nextUser }) => {
    tokenStore.set(token);
    setUser(nextUser);
  }, []);

  const value = useMemo(
    () => ({ user, loading, isLoggedIn: Boolean(user), completeLogin, logout, setUser }),
    [user, loading, completeLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
