import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const adminLayoutStyles = `
.admin-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(90deg, rgb(28, 27, 27) 0%, rgb(26, 23, 23) 100%);
}

.admin-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(90deg, rgb(28, 27, 27) 0%, rgb(26, 23, 23) 100%);
  color: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.admin-nav a {
  color: #e5e7eb;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background-color .15s ease, color .15s ease;
}
.admin-nav a:hover { background: rgba(255,255,255,0.1); color: #fff; }

.admin-nav button {
  margin-left: auto;
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,0.25);
  background: transparent;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
}
.admin-nav button:hover { background: rgba(255,255,255,0.12); }

.admin-main {
  width: 100%;
  max-width: 1080px;
  margin: 20px auto;
  padding: 0 16px 40px;
}

@media (max-width: 640px) {
  .admin-nav { flex-wrap: wrap; gap: 8px; }
  .admin-nav button { width: 100%; order: 99; }
}
`;

export default function AdminHome() {
  const { logout } = useAuth();
  return (
    <div className="admin-wrap">
      <style>{adminLayoutStyles}</style>
      <nav className="admin-nav">
        <Link to="/admin/dashboard">대시보드</Link>
        <Link to="/admin/achievements">성과 관리</Link>
        <Link to="/admin/members">멤버 관리</Link>
        <button onClick={logout}>로그아웃</button>
      </nav>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
