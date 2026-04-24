import { useEffect, useState } from "react";
import AdminUserActivityChart from "./AdminUserActivityChart";

export default function AdminHomePage({ username }) {
  const [stats, setStats] = useState({
    total_users: 0,
    total_trades: 0,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/user-stats", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || data.message || "Failed to fetch admin stats",
        );
      }

      setStats({
        total_users: data.total_users || 0,
        total_trades: data.total_trades || 0,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersWithTradeCount = async () => {
    try {
      const response = await fetch("/api/admin/users-with-trade-count", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchAdminStats();
    fetchUsersWithTradeCount();
  }, []);

  return (
    <div>
      <h1 className="user-homepage__title">Welcome Admin {username}</h1>

      {loading && <p className="info-message">Loading admin dashboard...</p>}
      {error && <p className="form-message error-message">{error}</p>}

      <div className="user-homepage__charts">
        <div className="user-homepage-chart-card admin-stats-card">
          <div className="admin-stat-item">
            <h2 className="user-homepage-chart-card__title">Total Users</h2>
            <h3 className="admin-stat-value">{stats.total_users}</h3>
          </div>

          <div className="admin-stat-item">
            <h2 className="user-homepage-chart-card__title">Total Trades</h2>
            <h3 className="admin-stat-value">{stats.total_trades}</h3>
          </div>
        </div>

        <AdminUserActivityChart users={users} />
      </div>

      <div className="trades-section">
        <h2 className="section-title">User Activity</h2>

        <div className="trade-table-wrapper">
          <table className="trade-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Total Trades</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.role === "admin" ? "N/A" : user.totalTrades}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && users.length === 0 && (
          <p className="info-message">No users found</p>
        )}
      </div>
    </div>
  );
}
