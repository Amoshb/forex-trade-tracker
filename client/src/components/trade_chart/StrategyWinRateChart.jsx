import { useEffect, useState } from "react";
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

export default function StrategyWinRateChart() {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await authApi.get(`/api/trades/trade_stats?groupBy=strategy`);

      const data = res.data;

      const formatted = (data.data || [])
        .map((item) => {
          const winRate =
            item.trade_count > 0
              ? (item.win_count / item.trade_count) * 100
              : 0;

          return {
            strategy: item.strategy,
            winRate: Number(winRate.toFixed(1)),
          };
        })
        .sort((a, b) => b.winRate - a.winRate);

      setChartData(formatted);
    } catch (error) {
      console.error(
        "Error fetching strategy efficiency:",
        error.response?.data?.message || error.message,
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="user-homepage-chart-card">
      <h2 className="user-homepage-chart-card__title">
        Strategy Consistency (Win %)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis
            type="category"
            dataKey="strategy"
            width={130}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(val) => [`${val}%`, "Win Rate"]} />
          <Bar dataKey="winRate" radius={[0, 6, 6, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.winRate >= 50 ? "#22c55e" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
