export default function UserPage({ user, onLogout }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Welcome to user Homepage - {user.username}</h1>

      <br />

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
