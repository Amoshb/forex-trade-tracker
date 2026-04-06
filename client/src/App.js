import { useState, useEffect } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import { jwtDecode } from "jwt-decode";

function App() {
  const [page, setPage] = useState("register");
  const [user, setUser] = useState(null);

  const handleLogout = (userData) => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("register");
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
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
    }
  }, []);

  const styles = {
    topRight: {
      position: "absolute",
      top: "20px",
      right: "20px",
    },
  };

  return (
    <div>
      {/* Top right buttons */}
      {!user && (
        <div style={styles.topRight}>
          <button
            style={{ marginRight: "10px" }}
            onClick={() => setPage("register")}
          >
            Register
          </button>

          <button onClick={() => setPage("login")}>Login</button>
        </div>
      )}

      {/* Main content */}
      {user ? (
        user.role === "admin" ? (
          <AdminPage user={user} onLogout={handleLogout} />
        ) : (
          <UserPage user={user} onLogout={handleLogout} />
        )
      ) : (
        <>{page === "register" ? <Register /> : <Login setUser={setUser} />}</>
      )}
    </div>
  );
}

export default App;
