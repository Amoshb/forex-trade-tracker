import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import AdminHomePage from "../components/admin/AdminHomePage";
import EditUsers from "../components/admin/EditUsers";


export default function AdminPage({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard-actions side-nav">
          <div className="sidebar__top">
            <button
              className={isActive("/admin-home") ? "active-btn" : ""}
              onClick={() => navigate("/admin-home")}
            >
              Admin Home
            </button>

            <button
              className={isActive("/edit-users") ? "active-btn" : ""}
              onClick={() => navigate("/edit-users")}
            >
              Manage Users
            </button>
          </div>
          <div className="sidebar__bottom">
            <button onClick={onLogout}>Logout</button>
          </div>
        </div>

        <div className="dashboard-section">
          <Routes>
            <Route path="/" element={<Navigate to="/admin-home" replace />} />
            <Route
              path="/admin-home"
              element={<AdminHomePage username={user.username} />}
            />
            <Route path="/edit-users" element={<EditUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
