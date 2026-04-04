import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Login({ setUser }) {
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
    <div style={{ textAlign: "center" }}>
      <h2>Login</h2>
      <label>Username: </label>
      <input
        type="text"
        placeholder="username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      <br />
      <label>Password: </label>
      <input
        type="password"
        placeholder="password"
        value={userPass}
        onChange={(e) => setUserPass(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleData}>Send</button>
      {message && <p>{message}</p>}
      <br />
      <br />
    </div>
  );
}
