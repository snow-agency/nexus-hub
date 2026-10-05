import { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'nexus_token';
const USER_KEY = 'nexus_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const storedToken =
        window.localStorage.getItem(TOKEN_KEY) ||
        window.sessionStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setAuthToken(storedToken);
      setToken(storedToken);

      try {
        const response = await api.get('/auth/me');

        const currentUser = response.data;

        setUser(currentUser);

        const storage = window.localStorage.getItem(TOKEN_KEY)
          ? window.localStorage
          : window.sessionStorage;

        storage.setItem(USER_KEY, JSON.stringify(currentUser));
      } catch {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.removeItem(USER_KEY);

        setAuthToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(email, password, rememberMe = false) {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { token: receivedToken, user: receivedUser } = response.data;

    const storage = rememberMe
      ? window.localStorage
      : window.sessionStorage;

    const otherStorage = rememberMe
      ? window.sessionStorage
      : window.localStorage;

    storage.setItem(TOKEN_KEY, receivedToken);
    storage.setItem(USER_KEY, JSON.stringify(receivedUser));

    otherStorage.removeItem(TOKEN_KEY);
    otherStorage.removeItem(USER_KEY);

    setAuthToken(receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  }

  async function register(name, email, password) {
    await api.post('/auth/register', {
      name,
      email,
      password,
    });
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);

    setAuthToken(null);
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth doit être utilisé à l’intérieur de AuthProvider.',
    );
  }

  return context;
}