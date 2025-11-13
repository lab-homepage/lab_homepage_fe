import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const LS_KEY = "lab_admin_basic";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const saved = localStorage.getItem(LS_KEY);
        if (!saved) return;
        const { username, password } = JSON.parse(saved);
        await api.post(
          "/api/admin/me",
          { id: username, password },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setUser({ username });
      } catch {
        localStorage.removeItem(LS_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (username, password) => {
    localStorage.setItem(LS_KEY, JSON.stringify({ username, password }));
    try {
      await api.post("/api/admin/me", { id: username, password });
      setUser({ username });
    } catch (e) {
      localStorage.removeItem(LS_KEY);
      throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const logout = () => {
    localStorage.removeItem(LS_KEY);
    setUser(null);
    navigate("/admin/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
