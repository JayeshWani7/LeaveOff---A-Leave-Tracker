import { useAuth } from "../context/AuthContext";

export function useApi() {
  const { token } = useAuth();

  return async (path, options = {}) => {
    const response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Request failed.");
    }

    return response.json();
  };
}
