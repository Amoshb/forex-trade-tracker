import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import LoadingButton from "../components/LoadingButton";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDelayMessage, setShowDelayMessage] = useState(false);

  const navigate = useNavigate();

  const isPasswordValid = () => userPass === confirmPass && userPass !== "";

  // delay message (only show if request is slow)
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowDelayMessage(true), 2000);
    } else {
      setShowDelayMessage(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const handleSubmit = async () => {
    if (!isPasswordValid()) {
      setMessage("Passwords do not match!");
      setUserPass("");
      setConfirmPass("");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
        setUserName("");
        setUserPass("");
        setConfirmPass("");
        setMessage(data?.message || "Registration failed");
        return;
      }

      setUserName("");
      setUserPass("");
      setConfirmPass("");
      setMessage(data?.message || "Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (e) {
      console.log(e);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="form-card">
        <h2 className="form-title">Register</h2>

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
            placeholder="password"
            value={userPass}
            onChange={(e) => setUserPass(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            placeholder="confirm password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <LoadingButton
            loading={loading}
            text="Register"
            loadingText="Creating account..."
            className="full-width-btn"
            onClick={handleSubmit}
          />
        </div>

        {/* normal message */}
        {message && <p className="form-message">{message}</p>}

        {/* delay message for cold start */}
        {showDelayMessage && (
          <p className="form-message">
            ⏳ Connecting to server... first request may take up to 50 seconds.
          </p>
        )}

        <p className="auth-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
