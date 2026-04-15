import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Login({ setUser, setPage }) {
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");
  const [message, setMessage] = useState("");

  const handleData = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userName, password: userPass }),
      });

      const data = await res.json();
      console.log("Server respone:", data);
      if (!res.ok) {
        setMessage(data?.message || "login failed");
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
          ></input>
        </div>

        <div className="form-group">
          <label className="form-label"> Password</label>
          <input
            type="password"
            placeholder="********"
            value={userPass}
            onChange={(e) => setUserPass(e.target.value)}
          ></input>
        </div>

        <div className="form-group">
          <button onClick={handleData} className="full-width-btn">
            send
          </button>
          {message && <p className="form-message"> {message}</p>}

          <p className="auth-link">
            Don’t have an account?{" "}
            <span onClick={() => setPage("register")}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
}
