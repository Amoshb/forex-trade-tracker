import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
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

  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 10;
  const currentPage = Math.max(Number(searchParams.get("page")) || 1, 1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalTrades, setTotalTrades] = useState(0);

  const fetchPaginatedTrades = useCallback(async (page) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/trades/all_trade_paginated?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch trades");
      }

      setTrades(data.trades);
      setTotalPages(data.pagination.totalPages);
      setTotalTrades(data.pagination.totalTrades);
    } catch (error) {
      console.error("Error fetching trades:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaginatedTrades(currentPage);
  }, [currentPage, fetchPaginatedTrades]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: String(currentPage + 1) });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: String(currentPage - 1) });
    }
  };

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

      const isLastTradeOnPage = trades.length === 1;
      const newPage =
        isLastTradeOnPage && currentPage > 1 ? currentPage - 1 : currentPage;

      setSearchParams({ page: String(newPage) });
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
    <div className="trades-section">
      <h2 className="section-title">My Trades</h2>

      <p className="info-message">
        Total Trades: {totalTrades} | Page {currentPage} of {totalPages}
      </p>

      {loading && <p className="info-message">Loading trades...</p>}
      {error && <p className="form-message error-message">{error}</p>}
      {!loading && trades.length === 0 && (
        <p className="info-message">No trades found</p>
      )}

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

      <div className="pagination-controls">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
