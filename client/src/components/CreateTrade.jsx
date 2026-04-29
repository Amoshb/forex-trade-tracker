import { useState } from "react";
import { authApi } from "../api";

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

      const response = await authApi.post("/api/trades/create", formData);

      const data = response.data;
      console.log("data: ", data);

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
      setError(error.response.data.message || error.message);
    }
  };

  return (
    <div className="trade-container">
      <div className="form-card trade-form-card">
        <h2 className="form-title">Add New Trade</h2>

        <form onSubmit={handleSubmit} className="trade-form">
          <div className="form-group form-row">
            <label className="form-label">Symbol: </label>
            <input
              type="text"
              name="symbol"
              placeholder="Symbol"
              value={formData.symbol}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-row">
            <label className="form-label">Direction:</label>

            <select
              name="direction"
              value={formData.direction}
              onChange={handleChange}
            >
              <option value="">Select Direction</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div className="form-group form-row">
            <label className="form-label">Open Price: </label>
            <input
              type="number"
              step="0.00001"
              name="openPrice"
              placeholder="Open Price"
              value={formData.openPrice}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-row">
            <label className="form-label">Close Price: </label>
            <input
              type="number"
              step="0.00001"
              name="closePrice"
              placeholder="Close Price"
              value={formData.closePrice}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-row">
            <label className="form-label">Volume: </label>
            <input
              type="number"
              step="0.01"
              name="volume"
              placeholder="Volume"
              value={formData.volume}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-row">
            <label className="form-label">Profit/Loss: </label>
            <input
              type="number"
              step="0.00001"
              name="profitLoss"
              placeholder="Profit/Loss"
              value={formData.profitLoss}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-row">
            <label className="form-label">Strategy: </label>
            <input
              type="text"
              name="strategy"
              placeholder="Strategy"
              value={formData.strategy}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-row">
            <label className="form-label">Notes: </label>
            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="full-width-btn">
              Create Trade
            </button>
          </div>
        </form>

        {message && <p className="form-message success-message">{message}</p>}
        {error && <p className="form-message error-message">{error}</p>}
      </div>
    </div>
  );
}
