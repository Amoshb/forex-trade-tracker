import AdminUserActivityChart from "./AdminUserActivityChart";
import { authApi } from "../../api";
import { useQuery } from "@tanstack/react-query";

export default function AdminHomePage({ username }) {
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsIsError,
    error: statsError,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await authApi.get("/api/admin/user-stats");
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersIsError,
    error: usersError,
  } = useQuery({
    queryKey: ["admin-users-with-trade-count"],
    queryFn: async () => {
      const response = await authApi.get("/api/admin/users-with-trade-count");
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const loading = statsLoading || usersLoading;

  const error =
    statsIsError || usersIsError
      ? statsError?.response?.data?.message ||
        statsError?.response?.data?.error ||
        usersError?.response?.data?.message ||
        usersError?.response?.data?.error ||
        statsError?.message ||
        usersError?.message
      : "";

  const stats = {
    total_users: statsData?.total_users || 0,
    total_trades: statsData?.total_trades || 0,
  };

  const users = usersData?.users || [];

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
