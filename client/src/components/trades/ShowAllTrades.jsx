import { useState, useEffect } from "react";
import TradeTable from "./TradeTable";

export default function ShowAllTrades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTradeId, setEditingTradeId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    symbol: "",
    direction: "",
    openPrice: "",
    closePrice: "",
    volume: "",
    profitLoss: "",
    strategy: "",
    notes: "",
  });

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/trades/all_trades", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch trades");
        }

        setTrades(data.trades);
      } catch (error) {
        console.error("Error fetching trades:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  const handleDeleteTrade = async (tradeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trade?",
    );
    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`/api/trades/delete/${tradeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete trade");
      }

      setTrades((prevTrades) =>
        prevTrades.filter((trade) => trade._id !== tradeId),
      );
    } catch (error) {
      console.error("Error deleting trade:", error);
      setError(error.message);
    }
  };

  const handleEditClick = (trade) => {
    setEditingTradeId(trade._id);
    setEditFormData({
      symbol: trade.symbol || "",
      direction: trade.direction || "",
      openPrice: trade.openPrice || "",
      closePrice: trade.closePrice || "",
      volume: trade.volume || "",
      profitLoss: trade.profitLoss || "",
      strategy: trade.strategy || "",
      notes: trade.notes || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingTradeId(null);
    setEditFormData({
      symbol: "",
      direction: "",
      openPrice: "",
      closePrice: "",
      volume: "",
      profitLoss: "",
      strategy: "",
      notes: "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateTrade = async (tradeId) => {
    try {
      setError("");

      const response = await fetch(`/api/trades/update/${tradeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update trade");
      }

      setTrades((prevTrades) =>
        prevTrades.map((trade) => (trade._id === tradeId ? data.trade : trade)),
      );

      setEditingTradeId(null);
    } catch (error) {
      console.error("Error updating trade:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>My Trades</h2>

      {loading && <p>Loading trades...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && trades.length === 0 && <p>No trades found</p>}

      {trades.length > 0 && (
        <TradeTable
          trades={trades}
          editingTradeId={editingTradeId}
          editFormData={editFormData}
          onEditClick={handleEditClick}
          onDeleteTrade={handleDeleteTrade}
          onEditChange={handleEditChange}
          onUpdateTrade={handleUpdateTrade}
          onCancelEdit={handleCancelEdit}
        />
      )}
    </div>
  );
}
