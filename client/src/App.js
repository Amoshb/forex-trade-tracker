import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthLoading(false);
      return;
    }

    try {
      const payload = jwtDecode(token);
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        setAuthLoading(false);
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
    } finally {
      setAuthLoading(false);
    }
  }, []);

  if (authLoading) {
    return <div className="app">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {!user ? (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : user.role === "admin" ? (
            <>
              <Route
                path="/*"
                element={<AdminPage user={user} onLogout={handleLogout} />}
              />
            </>
          ) : (
            <>
              <Route
                path="/*"
                element={<UserPage user={user} onLogout={handleLogout} />}
              />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
