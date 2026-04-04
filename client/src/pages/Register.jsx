import { useState } from "react";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
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
      console.log("Server respone:", data);
      if (!res.ok) {
        setUserName("");
        setUserPass("");
        setConfirmPass("");
        setMessage(data?.message || "Registration failed");
        return;
      } else {
        setUserName("");
        setUserPass("");
        setConfirmPass("");
        setMessage(data?.message || "Account created successfully!");
      }
    } catch (e) {
      console.log(e);
      setMessage("Network error");
    }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2> Register</h2>
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
      <label>Confirm Password: </label>
      <input
        type="password"
        placeholder="confirm password"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
      />

      <br />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {message && <p>{message}</p>}
      <br />
      <br />
    </div>
  );
}
