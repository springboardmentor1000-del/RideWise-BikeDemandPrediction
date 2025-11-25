import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user from JWT
  async function fetchUser() {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/accounts/get_user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser({ username: data.username, email: data.email });
      } else {
        // Try refresh token if expired
        const refreshed = await refreshAccessToken();
        if (refreshed) await fetchUser();
        else setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Refresh token
  async function refreshAccessToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return false;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/accounts/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access", data.access);
        console.log("🔄 Access token refreshed");
        return true;
      } else {
        console.warn("Refresh token invalid");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return false;
      }
    } catch (err) {
      console.error("Refresh failed:", err);
      return false;
    }
  }

  // ✅ Sign In
  async function signin(username, password) {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/accounts/signin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("Signin response:", data);

      if (res.ok && data.access) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        setUser({ username: data.username || username, email: data.email || "" });
        return true;
      } else {
        alert(data.detail || "Invalid credentials");
        return false;
      }
    } catch (err) {
      console.error("Signin error:", err);
      alert("Error during signin");
      return false;
    }
  }

  // ✅ Sign Out
  async function signout() {
    const refreshToken = localStorage.getItem("refresh");
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/accounts/signout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (err) {
      console.error("Signout error:", err);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
    }
  }

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = { user, setUser, loading, signin, signout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
