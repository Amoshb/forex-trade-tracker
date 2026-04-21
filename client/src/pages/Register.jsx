import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const isPasswordValid = () => userPass === confirmPass && userPass !== "";

  const handleSubmit = async () => {
    if (!isPasswordValid()) {
      setMessage("Password do not match!");
      setUserPass("");
      setConfirmPass("");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, userPass }),
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

      // optional: send user straight to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (e) {
      console.log(e);
      setMessage("Network error");
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
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="password"
            value={userPass}
            onChange={(e) => setUserPass(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            placeholder="confirm password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>

        <div className="form-group">
          <button onClick={handleSubmit} className="full-width-btn">
            Submit
          </button>
        </div>

        {message && <p className="form-message">{message}</p>}

        <p className="auth-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
