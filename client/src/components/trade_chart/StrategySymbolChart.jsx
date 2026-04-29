import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { authApi } from "../../api";

export default function StrategySymbolChart() {
  const [rawData, setRawData] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStrategySymbolStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authApi.get(
        `/api/trades/trade_stats?groupBy=strategy,symbol`,
      );

      const data = response.data;

      const formattedData = (data.data || []).map((item) => ({
        strategy: item.strategy,
        symbol: item.symbol,
        totalPnL: item.totalPnL,
        winCount: item.win_count,
        lossCount: item.loss_count,
        tradeCount: item.trade_count,
      }));

      setRawData(formattedData);

      if (formattedData.length > 0) {
        const uniqueStrategies = [
          ...new Set(formattedData.map((item) => item.strategy)),
        ];
        setSelectedStrategy(uniqueStrategies[0]);
      }
    } catch (error) {
      console.error("Error fetching strategy-symbol stats:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategySymbolStats();
  }, []);

  const strategies = useMemo(() => {
    return [...new Set(rawData.map((item) => item.strategy))];
  }, [rawData]);

  const filteredChartData = useMemo(() => {
    return rawData
      .filter((item) => item.strategy === selectedStrategy)
      .sort((a, b) => b.totalPnL - a.totalPnL)
      .map((item) => ({
        name: item.symbol,
        totalPnL: item.totalPnL,
        winCount: item.winCount,
        lossCount: item.lossCount,
        tradeCount: item.tradeCount,
      }));
  }, [rawData, selectedStrategy]);

  if (loading) {
    return (
      <div className="user-homepage-chart-card">
        <h2 className="user-homepage-chart-card__title">
          Strategy Performance by Symbol
        </h2>
        <p className="user-homepage-chart-card__message">
          Loading strategy-symbol chart...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-homepage-chart-card">
        <h2 className="user-homepage-chart-card__title">
          Strategy Performance by Symbol
        </h2>
        <p className="user-homepage-chart-card__message user-homepage-chart-card__message--error">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="user-homepage-chart-card">
      <div className="user-homepage-chart-card__header">
        <h2 className="user-homepage-chart-card__title">
          Strategy Performance by Symbol
        </h2>

        <select
          className="user-homepage-chart-card__select"
          value={selectedStrategy}
          onChange={(e) => setSelectedStrategy(e.target.value)}
        >
          {strategies.map((strategy) => (
            <option key={strategy} value={strategy}>
              {strategy}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={filteredChartData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value, name) => {
              const num = Number(value);

              if (name === "totalPnL") {
                return [
                  num.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
                  `Net PnL ${num < 0 ? "(Loss)" : "(Profit)"}`,
                ];
              }

              if (name === "winCount") {
                return [num, "Wins"];
              }

              if (name === "lossCount") {
                return [num, "Losses"];
              }

              if (name === "tradeCount") {
                return [num, "Trades"];
              }

              return [num, name];
            }}
          />
          <Bar dataKey="totalPnL" radius={[0, 6, 6, 0]}>
            {filteredChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.totalPnL >= 0 ? "#22c55e" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
