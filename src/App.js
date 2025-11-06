import Navbar from "./component/Navbar";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./component/pages/Home";
import Introduction from "./component/pages/Intro/Introduction";
import Comments from "./component/pages/Comments/Comments";
import Members from "./component/pages/Team/Members";
import Professor from "./component/pages/Team/Professor.js";
import Researchers from "./component/pages/Team/Researchers.js";
import News from "./component/pages/Achievement/News";
import Details from "./component/pages/Achievement/Details.js";
import AdminLayout from "./component/pages/admin/AdminLayout.jsx";
import Login from "./component/pages/admin/Login.jsx";
import Dashboard from "./component/pages/admin/DashBoard.jsx";
import AchievementAdmin from "./component/pages/admin/AchievementAdmin.jsx";
import MembersAdmin from "./component/pages/admin/MembersAdmin.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AuthProvider from "./context/AuthContext.jsx";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            {/* === 일반 사용자 페이지 === */}
            <Route path="/" element={<Home />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/achievements" element={<News />} />
            <Route path="/achievements/:id" element={<Details />} />
            <Route path="/professor" element={<Members />} />
            <Route path="/professor" element={<Professor />} />
            <Route path="/researchers" element={<Researchers />} />

            {/* === 관리자 페이지 === */}
            <Route path="/admin/login" element={<Login />} />

            {/* 보호된 관리자 라우트 (로그인 필요) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="achievements" element={<AchievementAdmin />} />
                <Route path="members" element={<MembersAdmin />} />
              </Route>
            </Route>

            {/* === 잘못된 경로는 홈으로 === */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
