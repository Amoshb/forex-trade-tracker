export default function AdminPage({ user, onLogout }) {
  const callAdminWelcome = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/admin/admin-only", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);
    alert(data.message);
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Welcome to Admin Homepage - {user.username}</h1>

      <br />
      <button onClick={callAdminWelcome}>Test Admin Route</button>

      <br />
      <br />

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
