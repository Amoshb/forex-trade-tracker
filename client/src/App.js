import { useEffect, useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import { jwtDecode } from "jwt-decode";

function App() {
  const [page, setPage] = useState("register");
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = jwtDecode(token);

      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem("token");
        return;
      }

      setUser({
        userID: payload.userID,
        username: payload.username,
        role: payload.role,
      });
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <div>
      {user ? (
        user.role === "admin" ? (
          <AdminPage user={user} onLogout={handleLogout} />
        ) : (
          <UserPage user={user} onLogout={handleLogout} />
        )
      ) : (
        <>
          {page === "register" ? <Register /> : <Login setUser={setUser} />}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button
              style={{ marginRight: "20px" }}
              onClick={() => setPage("register")}
            >
              Register
            </button>

            <button onClick={() => setPage("login")}> Login</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
