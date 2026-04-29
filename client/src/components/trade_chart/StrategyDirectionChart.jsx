import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { authApi } from "../../api";
import { useQuery } from "@tanstack/react-query";

export default function StrategyDirectionChart() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["groupBy_strategy_direction"],
    queryFn: async () => {
      const res = await authApi.get(
        `/api/trades/trade_stats?groupBy=strategy,direction`,
      );
      return res.data;
    },
  });

  const chartData = useMemo(() => {
    if (!data?.data?.length) return [];

    const grouped = {};

    data.data.forEach((item) => {
      const strategy = item.strategy || "Unknown";
      const direction = (item.direction || "unknown").toLowerCase();

      if (!grouped[strategy]) {
        grouped[strategy] = {
          strategy,
          buy: 0,
          sell: 0,
          buyTrades: 0,
          sellTrades: 0,
        };
      }

      if (direction === "buy") {
        grouped[strategy].buy = item.totalPnL || 0;
        grouped[strategy].buyTrades = item.trade_count || 0;
      }

      if (direction === "sell") {
        grouped[strategy].sell = item.totalPnL || 0;
        grouped[strategy].sellTrades = item.trade_count || 0;
      }
    });

    return Object.values(grouped).sort(
      (a, b) => b.buy + b.sell - (a.buy + a.sell),
    );
  }, [data]);

  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => {
        acc.buyTotal += item.buy;
        acc.sellTotal += item.sell;
        return acc;
      },
      { buyTotal: 0, sellTotal: 0 },
    );
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="user-homepage-chart-card">
        <h2 className="user-homepage-chart-card__title">
          Strategy Buy vs Sell
        </h2>
        <p className="user-homepage-chart-card__message">
          Loading strategy-direction chart...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="user-homepage-chart-card">
        <h2 className="user-homepage-chart-card__title">
          Strategy Buy vs Sell
        </h2>
        <p className="user-homepage-chart-card__message user-homepage-chart-card__message--error">
          {error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="user-homepage-chart-card">
      <div className="user-homepage-chart-card__header">
        <h2 className="user-homepage-chart-card__title">
          Strategy Buy vs Sell
        </h2>
      </div>

      <div className="user-homepage-chart-card__mini-stats">
        <div className="user-homepage-chart-card__mini-stat">
          <span>Buy PnL</span>
          <strong>{totals.buyTotal.toFixed(2)}</strong>
        </div>

        <div className="user-homepage-chart-card__mini-stat">
          <span>Sell PnL</span>
          <strong>{totals.sellTotal.toFixed(2)}</strong>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={["auto", "auto"]} />
          <YAxis
            type="category"
            dataKey="strategy"
            width={130}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value, name) => {
              const numericValue = Number(value);
              const label = name === "buy" ? "Buy PnL" : "Sell PnL";

              return [
                numericValue.toFixed(2),
                `${label} ${numericValue < 0 ? "(Loss)" : "(Profit)"}`,
              ];
            }}
          />
          <Legend />
          <Bar
            dataKey="buy"
            fill="#22c55e"
            barSize={10}
            radius={[0, 6, 6, 0]}
          />
          <Bar
            dataKey="sell"
            fill="#ef4444"
            barSize={10}
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
