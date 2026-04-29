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

export default function StrategyWinLossChart() {
  const { data } = useQuery({
    queryKey: ["groupBy_strategy"],
    queryFn: async () => {
      const res = await authApi.get(`/api/trades/trade_stats?groupBy=strategy`);
      return res.data;
    },
  });

  const chartData = useMemo(() => {
    if (!data?.data?.length) return [];
    return data.data.map((item) => ({
      strategy: item.strategy,
      wins: item.win_count,
      losses: item.loss_count,
      breakeven: item.breakeven_count,
    }));
  }, [data]);

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
