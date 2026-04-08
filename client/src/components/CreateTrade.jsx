import { useState } from "react";

export default function CreateTrade() {
  const [formData, setFormData] = useState({
    symbol: "",
    direction: "",
    openPrice: "",
    closePrice: "",
    volume: "",
    profitLoss: "",
    strategy: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const response = await fetch("/api/trades/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create trade");
      }

      setMessage("Trade created successfully");

      setFormData({
        symbol: "",
        direction: "",
        openPrice: "",
        closePrice: "",
        volume: "",
        profitLoss: "",
        strategy: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error creating trade:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Add New Trade</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "10px", maxWidth: "400px" }}
      >
        <input
          type="text"
          name="symbol"
          placeholder="Symbol"
          value={formData.symbol}
          onChange={handleChange}
        />

        <input
          type="text"
          name="direction"
          placeholder="Direction"
          value={formData.direction}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.00001"
          name="openPrice"
          placeholder="Open Price"
          value={formData.openPrice}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.00001"
          name="closePrice"
          placeholder="Close Price"
          value={formData.closePrice}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.01"
          name="volume"
          placeholder="Volume"
          value={formData.volume}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.00001"
          name="profitLoss"
          placeholder="Profit/Loss"
          value={formData.profitLoss}
          onChange={handleChange}
        />

        <input
          type="text"
          name="strategy"
          placeholder="Strategy"
          value={formData.strategy}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">Create Trade</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
