import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { authApi } from "../../api";

export default function StrategyUsageChart() {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await authApi.get(`/api/trades/trade_stats?groupBy=strategy`);

      const data = res.data;

      const formatted = (data.data || []).map((item) => ({
        strategy: item.strategy,
        trades: item.trade_count,
      }));

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
        Strategy Usage (Trades)
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis type="number" />
          <YAxis dataKey="strategy" type="category" width={120} />

          <Tooltip formatter={(val) => [val, "Trades"]} />

          <Bar dataKey="trades" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
