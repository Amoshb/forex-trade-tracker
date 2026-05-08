import { useState } from "react";
import { authApi } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createTrade = useMutation({
    mutationFn: async () => {
      const response = await authApi.post("/api/trades/create", formData);
      return response.data;
    },

    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ["total_win_and_loss"] });
      queryClient.invalidateQueries({ queryKey: ["groupBy_strategy"] });
      queryClient.invalidateQueries({
        queryKey: ["groupBy_strategy_direction"],
      });
      queryClient.invalidateQueries({ queryKey: ["groupBy_strategy_symbol"] });
    },
  });

  return (
    <div className="trade-container">
      <div className="form-card trade-form-card">
        <h2 className="form-title">Add New Trade</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createTrade.mutate();
          }}
          className="trade-form"
        >
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
              required
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
              required
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
              required
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
              required
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
              required
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
            <button type="submit" disabled={createTrade.isPending}>
              {createTrade.isPending ? "Creating..." : "Create Trade"}
            </button>
          </div>
        </form>

        {createTrade.isSuccess && (
          <p className="form-message success-message">
            Trade created successfully
          </p>
        )}
        {createTrade.isError && (
          <p className="form-message error-message">
            {createTrade.error?.response?.data?.message ||
              createTrade.error?.message}
          </p>
        )}
      </div>
    </div>
  );
}
