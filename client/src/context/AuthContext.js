import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { authService } from "../services/auth.service";
import { STORAGE_KEY } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let ignore = false;

    const restoreSession = async () => {
      const storedSession = localStorage.getItem(STORAGE_KEY);

      if (!storedSession) {
        if (!ignore) {
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const parsedSession = JSON.parse(storedSession);
        setToken(parsedSession.token);
        const profile = await authService.getCurrentUser(parsedSession.token);

        if (!ignore) {
          setUser(profile);
        }
      } catch (_error) {
        localStorage.removeItem(STORAGE_KEY);
        if (!ignore) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsBootstrapping(false);
        }
      }
    };

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  const persistSession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: nextToken,
        user: nextUser,
      })
    );
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      async login(credentials) {
        const response = await authService.login(credentials);
        persistSession(response.token, response.user);
        return response.user;
      },
      async register(payload) {
        const response = await authService.register(payload);
        persistSession(response.token, response.user);
        return response.user;
      },
      logout() {
        setToken(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [isBootstrapping, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
