import { useState } from "react";
import { authApi } from "../../api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export default function EditUsers() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error: usersError,
  } = useQuery({
    queryKey: ["admin-users-with-trade-count"],
    queryFn: async () => {
      const response = await authApi.get("/api/admin/users-with-trade-count");
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const users = data?.users || [];

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await authApi.delete(`/api/admin/delete-user/${userId}`);
      return response.data;
    },
    onSuccess: (data) => {
      setError("");
      setMessage(data.message || "User deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-users-with-trade-count"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-stats"],
      });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      setMessage("");
      setError(error.response?.data?.message || error.message);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      const response = await authApi.put(
        `/api/admin/update-user-role/${userId}`,
        {
          role: newRole,
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      setError("");
      setMessage(data.message || "User role updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-users-with-trade-count"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-stats"],
      });
    },
    onError: (error) => {
      console.error("Error updating role:", error);
      setMessage("");
      setError(error.response?.data?.message || error.message);
    },
  });

  const handleDeleteUser = (userId, totalTrades) => {
    const confirmed = window.confirm(
      `This user has ${totalTrades || 0} trades. Delete this user and all related trades?`,
    );

    if (!confirmed) return;

    deleteUserMutation.mutate(userId);
  };

  const handleRoleChange = (userId, newRole) => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  const loading =
    isLoading || deleteUserMutation.isPending || updateRoleMutation.isPending;

  const displayError =
    error ||
    (isError
      ? usersError?.response?.data?.message ||
        usersError?.response?.data?.error ||
        usersError?.message
      : "");

  return (
    <div className="trades-section">
      <h2 className="section-title">Manage Users</h2>

      {loading && <p className="info-message">Loading users...</p>}
      {message && <p className="form-message success-message">{message}</p>}
      {displayError && (
        <p className="form-message error-message">{displayError}</p>
      )}

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
                    disabled={updateRoleMutation.isPending}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>

                <td>
                  <button
                    disabled={deleteUserMutation.isPending}
                    onClick={() => handleDeleteUser(user._id, user.totalTrades)}
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && users.length === 0 && (
        <p className="info-message">No users found</p>
      )}
    </div>
  );
}
