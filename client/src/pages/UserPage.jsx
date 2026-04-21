import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ShowAllTrades from "../components/trades/ShowAllTrades";
import CreateTrade from "../components/CreateTrade";
import UserHomepage from "../components/trade_chart/UserHomepage";

export default function UserPage({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-page">
      <div className="dashboard-topbar">
        <button onClick={onLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <button
            className={isActive("/home") ? "active-btn" : ""}
            onClick={() => navigate("/home")}
          >
            Home Page
          </button>

          <button
            className={isActive("/trades") ? "active-btn" : ""}
            onClick={() => navigate("/trades")}
          >
            Show My Trades
          </button>

          <button
            className={isActive("/create-trade") ? "active-btn" : ""}
            onClick={() => navigate("/create-trade")}
          >
            Create New Trade
          </button>
        </div>

        <div className="dashboard-section">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route
              path="/home"
              element={<UserHomepage username={user.username} />}
            />
            <Route path="/trades" element={<ShowAllTrades />} />
            <Route path="/create-trade" element={<CreateTrade />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
