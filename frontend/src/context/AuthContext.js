import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "leaveoff_auth";
const API_BASE = process.env.REACT_APP_API_BASE || "";

function getStoredAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => getStoredAuth());

  const login = useCallback(async (username, password) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Login failed.");
    }

    const data = await response.json();
    const nextState = { token: data.token, user: data.user };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    setAuthState(nextState);
    return nextState;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setAuthState(null);
  }, []);

  const value = useMemo(
    () => ({
      token: authState ? authState.token : null,
      user: authState ? authState.user : null,
      login,
      logout,
    }),
    [authState, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
