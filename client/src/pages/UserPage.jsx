import { useState } from "react";
import ShowAllTrades from "../components/trades/ShowAllTrades";
import CreateTrade from "../components/CreateTrade";

export default function UserPage({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState("");

  return (
    <div className="dashboard-page">
      <div className="dashboard-topbar">
        <button onClick={onLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <h1 className="dashboard-title">Welcome {user.username}!</h1>

        <div className="dashboard-actions">
          <button onClick={() => setActiveSection("home")}>Home Page</button>
          <button onClick={() => setActiveSection("trades")}>
            Show My Trades
          </button>
          <button onClick={() => setActiveSection("create")}>
            Create New Trade
          </button>
        </div>

        <div className="dashboard-section">
          {activeSection === "trades" && <ShowAllTrades />}
          {activeSection === "create" && <CreateTrade />}
        </div>
      </div>
    </div>
  );
}
