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

export default function StrategyUsageChart() {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    const res = await fetch("/api/trades/trade_stats?groupBy=strategy", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    const formatted = (data.data || []).map((item) => ({
      strategy: item.strategy,
      trades: item.trade_count,
    }));

    setChartData(formatted);
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
