import { useState } from "react";
import ShowAllTrades from "../components/trades/ShowAllTrades";
import CreateTrade from "../components/CreateTrade";

export default function UserPage({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState("");

  return (
    <div style={{ textAlign: "right", padding: "20px" }}>
      <button onClick={onLogout}>Logout</button>
      <div style={{ textAlign: "center" }}>
        <h1>Welcome to user Homepage - {user.username}</h1>

        <br />
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button onClick={() => setActiveSection("home")}>Home Page</button>
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button onClick={() => setActiveSection("trades")}>
            Show My Trades
          </button>
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button onClick={() => setActiveSection("create")}>
            Create New Trade
          </button>
        </div>

        <div style={{ marginTop: "20px" }}>
          {activeSection === "trades" && <ShowAllTrades />}
          {activeSection === "create" && <CreateTrade />}
        </div>
      </div>
    </div>
  );
}
