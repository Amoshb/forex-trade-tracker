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

  const [filters, setFilters] = useState({
    symbol: "",
    direction: "",
    strategy: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    symbols: [],
    directions: [],
    strategies: [],
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 10;
  const currentPage = Math.max(Number(searchParams.get("page")) || 1, 1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalTrades, setTotalTrades] = useState(0);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await fetch("/api/trades/filter-options", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      console.log("filter options response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || data.message || "Failed to fetch filter options",
        );
      }

      setFilterOptions({
        symbols: data.symbols || [],
        directions: data.directions || [],
        strategies: data.strategies || [],
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  }, []);

  const fetchPaginatedTrades = useCallback(
    async (page) => {
      try {
        setLoading(true);
        setError("");

        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (filters.symbol) query.append("symbol", filters.symbol);
        if (filters.direction) query.append("direction", filters.direction);
        if (filters.strategy) query.append("strategy", filters.strategy);

        const url = `/api/trades/all_trade_paginated?${query.toString()}`;
        console.log("fetch trades url:", url);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        console.log("paginated trades response:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || data.message || "Failed to fetch trades",
          );
        }

        setTrades(data.trades || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalTrades(data.pagination?.totalTrades || 0);
      } catch (error) {
        console.error("Error fetching trades:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

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

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSearchParams({ page: "1" });
  };

  const handleResetFilters = () => {
    setFilters({
      symbol: "",
      direction: "",
      strategy: "",
    });

    setSearchParams({ page: "1" });
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
        throw new Error(data.error || data.message || "Failed to delete trade");
      }

      // instant UI update
      setTrades((prev) => prev.filter((t) => t._id !== tradeId));
      setTotalTrades((prev) => prev - 1);

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
        throw new Error(data.error || data.message || "Failed to update trade");
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

      <div className="trade-filters">
        <select
          value={filters.symbol}
          onChange={(e) => handleFilterChange("symbol", e.target.value)}
        >
          <option value="">All Symbols</option>
          {filterOptions.symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>

        <select
          value={filters.direction}
          onChange={(e) => handleFilterChange("direction", e.target.value)}
        >
          <option value="">All Directions</option>
          {filterOptions.directions.map((direction) => (
            <option key={direction} value={direction}>
              {direction}
            </option>
          ))}
        </select>

        <select
          value={filters.strategy}
          onChange={(e) => handleFilterChange("strategy", e.target.value)}
        >
          <option value="">All Strategies</option>
          {filterOptions.strategies.map((strategy) => (
            <option key={strategy} value={strategy}>
              {strategy}
            </option>
          ))}
        </select>

        <button onClick={handleResetFilters}>Reset</button>
      </div>

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
