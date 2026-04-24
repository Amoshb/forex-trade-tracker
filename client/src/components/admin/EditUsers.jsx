import { useEffect, useState } from "react";
import API_BASE_URL from "../../api";

export default function EditUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_BASE_URL}/api/admin/users-with-trade-count`, {
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
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user and all their trades?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_BASE_URL}/api/admin/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to delete user");
      }

      setMessage(data.message || "User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_BASE_URL}/api/admin/update-user-role/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to update role");
      }

      setMessage(data.message || "User role updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      setError(error.message);
    }
  };

  return (
    <div className="trades-section">
      <h2 className="section-title">Manage Users</h2>

      {message && <p className="form-message success-message">{message}</p>}
      {error && <p className="form-message error-message">{error}</p>}

      <div className="trade-table-wrapper">
        <table className="trade-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Total Trades</th>
              <th>Change Role</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.role === "admin" ? "N/A" : user.totalTrades}</td>

                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>

                <td>
                  <button onClick={() => handleDeleteUser(user._id)}>
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && <p className="info-message">No users found</p>}
    </div>
  );
}
