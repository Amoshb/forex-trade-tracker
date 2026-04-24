import { useEffect, useState } from "react";
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

export default function StrategyWinLossChart() {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/trades/trade_stats?groupBy=strategy", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("Failed to fetch");
      }

      const formatted = (data.data || []).map((item) => ({
        strategy: item.strategy,
        wins: item.win_count,
        losses: item.loss_count,
        breakeven: item.breakeven_count,
      }));

      setChartData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="user-homepage-chart-card">
      <h2 className="user-homepage-chart-card__title">
        Wins vs Losses (Per Strategy)
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />

          {/* numbers go on X */}
          <XAxis type="number" />

          {/* categories go on Y */}
          <YAxis type="category" dataKey="strategy" width={120} />

          <Tooltip />
          <Legend />

          <Bar dataKey="wins" fill="#22c55e" name="Wins" />
          <Bar dataKey="losses" fill="#ef4444" name="Losses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
