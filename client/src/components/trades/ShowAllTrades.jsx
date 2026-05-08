import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TradeTable from "./TradeTable";
import { authApi } from "../../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ShowAllTrades() {
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 10;
  const currentPage = Math.max(Number(searchParams.get("page")) || 1, 1);

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

  const analyticsQueryKeys = [
    ["total_win_and_loss"],
    ["groupBy_strategy"],
    ["groupBy_strategy_direction"],
    ["groupBy_strategy_symbol"],
  ];

  const invalidateAnalytics = () => {
    analyticsQueryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey });
    });
  };

  const filterOptionsQuery = useQuery({
    queryKey: ["trade_filter_options"],
    queryFn: async () => {
      const response = await authApi.get("/api/trades/filter-options");

      return {
        symbols: response.data.symbols || [],
        directions: response.data.directions || [],
        strategies: response.data.strategies || [],
      };
    },
  });

  const tradesQuery = useQuery({
    queryKey: ["paginated_trades", currentPage, filters],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: String(currentPage),
        limit: String(limit),
      });

      if (filters.symbol) query.append("symbol", filters.symbol);
      if (filters.direction) query.append("direction", filters.direction);
      if (filters.strategy) query.append("strategy", filters.strategy);

      const response = await authApi.get(
        `/api/trades/all_trade_paginated?${query.toString()}`,
      );

      return {
        trades: response.data.trades || [],
        totalPages: response.data.pagination?.totalPages || 1,
        totalTrades: response.data.pagination?.totalTrades || 0,
      };
    },
    keepPreviousData: true,
  });

  const deleteTradeMutation = useMutation({
    mutationFn: async (tradeId) => {
      await authApi.delete(`/api/trades/delete/${tradeId}`);
      return tradeId;
    },
    onSuccess: async () => {
      invalidateAnalytics();

      await queryClient.invalidateQueries({
        queryKey: ["paginated_trades"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["trade_filter_options"],
      });

      const trades = tradesQuery.data?.trades || [];

      const isLastTradeOnPage = trades.length === 1;
      const shouldMoveBack = isLastTradeOnPage && currentPage > 1;

      if (shouldMoveBack) {
        setSearchParams({ page: String(currentPage - 1) });
      }
    },
  });

  const updateTradeMutation = useMutation({
    mutationFn: async (tradeId) => {
      const cleanedFormData = {
        ...editFormData,
        symbol: editFormData.symbol.trim().toUpperCase(),
        direction: editFormData.direction,
        strategy: editFormData.strategy.trim(),
        notes: editFormData.notes.trim(),
      };

      const response = await authApi.put(
        `/api/trades/update/${tradeId}`,
        cleanedFormData,
      );

      return response.data.trade;
    },
    onSuccess: async () => {
      invalidateAnalytics();

      await queryClient.invalidateQueries({
        queryKey: ["paginated_trades"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["trade_filter_options"],
      });

      setEditingTradeId(null);
      resetEditForm();
    },
  });

  const filterOptions = filterOptionsQuery.data || {
    symbols: [],
    directions: [],
    strategies: [],
  };

  const trades = tradesQuery.data?.trades || [];
  const totalPages = tradesQuery.data?.totalPages || 1;
  const totalTrades = tradesQuery.data?.totalTrades || 0;

  const loading =
    tradesQuery.isLoading ||
    filterOptionsQuery.isLoading ||
    deleteTradeMutation.isPending ||
    updateTradeMutation.isPending;

  const error =
    tradesQuery.error?.response?.data?.message ||
    tradesQuery.error?.message ||
    filterOptionsQuery.error?.response?.data?.message ||
    filterOptionsQuery.error?.message ||
    deleteTradeMutation.error?.response?.data?.message ||
    deleteTradeMutation.error?.message ||
    updateTradeMutation.error?.response?.data?.message ||
    updateTradeMutation.error?.message ||
    "";

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

  const handleDeleteTrade = (tradeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trade?",
    );

    if (!confirmed) return;

    deleteTradeMutation.mutate(tradeId);
  };

  const handleEditClick = (trade) => {
    setEditingTradeId(trade._id);

    setEditFormData({
      symbol: trade.symbol || "",
      direction: trade.direction || "",
      openPrice: trade.openPrice ?? "",
      closePrice: trade.closePrice ?? "",
      volume: trade.volume ?? "",
      profitLoss: trade.profitLoss ?? "",
      strategy: trade.strategy || "",
      notes: trade.notes || "",
    });
  };

  const resetEditForm = () => {
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

  const handleCancelEdit = () => {
    setEditingTradeId(null);
    resetEditForm();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateTrade = (tradeId) => {
    updateTradeMutation.mutate(tradeId);
  };

  return (
    <div className="trades-section">
      <h2 className="section-title">My Trades</h2>

      <div className="trade-filters">
        <select
          value={filters.symbol}
          onChange={(e) => handleFilterChange("symbol", e.target.value)}
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
        >
          <option value="">All Strategies</option>
          {filterOptions.strategies.map((strategy) => (
            <option key={strategy} value={strategy}>
              {strategy}
            </option>
          ))}
        </select>

        <button onClick={handleResetFilters} disabled={loading}>
          Reset
        </button>
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
