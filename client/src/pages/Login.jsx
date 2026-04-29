import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";
import { publicApi } from "../api";

export default function Login({ setUser }) {
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await publicApi.post("/api/auth/login", {
        username: userName,
        password: userPass,
      });

      const data = res.data;
      console.log("Server response:", data);

      setMessage(data?.message || "Login successfully!");

      localStorage.setItem("token", data.accessToken);

      const payload = jwtDecode(data.accessToken);

      setUser({
        userID: payload.userID,
        username: payload.username,
        role: payload.role,
      });

      navigate("/");
    } catch (e) {
      console.log(e);
      setMessage(e.response?.data?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="form-card">
        <h2 className="form-title">Login</h2>

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="********"
            value={userPass}
            onChange={(e) => setUserPass(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <LoadingButton
            loading={loading}
            text="Login"
            loadingText="Logging in..."
            className="full-width-btn"
            onClick={handleData}
          />

          {message && <p className="form-message">{message}</p>}
          {loading && (
            <p className="form-message">
              ⏳ Logging in... The server may be waking up (this can take up to
              50 seconds).
            </p>
          )}

          <p className="auth-link">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
}
