import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const loginStyles = `
/* Container */
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f8fa;
  padding: 24px;
}

/* Card */
.login-form {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

/* Title */
.login-form h2 {
  margin: 0 0 18px;
  font-size: 22px;
  line-height: 1.2;
  color: #111827;
}

/* Inputs */
.login-form input {
  width: 92%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  margin-bottom: 12px;
}

.login-form input::placeholder {
  color: #9ca3af;
}

.login-form input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Error */
.login-form .error {
  margin: 4px 0 12px;
  color: #d93025;
  font-size: 13px;
}

/* Button */
.login-form button[type="submit"] {
  width: 100%;
  padding: 12px 14px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.02s ease;
}

.login-form button[type="submit"]:hover {
  background: #1e40af;
}

.login-form button[type="submit"]:active {
  transform: translateY(1px);
}

.login-form button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Small screens */
@media (max-width: 480px) {
  .login-form {
    padding: 22px;
    border-radius: 10px;
  }
  .login-form h2 {
    font-size: 20px;
  }
}
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(username, password);
      nav("/admin/dashboard", { replace: true });
    } catch (e) {
      setErr("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <>
      <style>{loginStyles}</style>
      <div className="login-wrap">
        <form className="login-form" onSubmit={onSubmit}>
          <h2>관리자 로그인</h2>
          <input
            placeholder="ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="error">{err}</p>}
          <button type="submit">로그인</button>
        </form>
      </div>
    </>
  );
}
