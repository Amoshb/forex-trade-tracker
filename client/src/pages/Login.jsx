import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ✅ new

  const handleData = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: userPass,
        }),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (!res.ok) {
        setMessage(data?.message || "Login failed");
        return;
      }

      setMessage(data?.message || "Login successfully!");

      localStorage.setItem("token", data.accessToken);

      const payload = jwtDecode(data.accessToken);

      setUser({
        userID: payload.userID,
        username: payload.username,
        role: payload.role,
      });

      // ✅ optional (App.js will handle redirect anyway)
      navigate("/");
    } catch (e) {
      console.log(e);
      setMessage("Network error");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="form-card">
        <h2 className="form-title">Login</h2>

        <div className="form-group">
          <label className="form-label"> Username</label>
          <input
            type="text"
            placeholder="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label"> Password</label>
          <input
            type="password"
            placeholder="********"
            value={userPass}
            onChange={(e) => setUserPass(e.target.value)}
          />
        </div>

        <div className="form-group">
          <button onClick={handleData} className="full-width-btn">
            send
          </button>

          {message && <p className="form-message">{message}</p>}

          <p className="auth-link">
            Don’t have an account? {/* ✅ FIXED */}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
}
