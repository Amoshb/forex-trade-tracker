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

export default function StrategyEfficiencyChart() {
    const [chartData, setChartData] = useState([]);

    const fetchData = async () => {
      try {
        const res = await authApi.get(
          `/api/trades/trade_stats?groupBy=strategy`,
        );

        const data = res.data;

        const formatted = (data.data || [])
          .map((item) => {
            const avgPnL =
              item.trade_count > 0 ? item.totalPnL / item.trade_count : 0;

            return {
              strategy: item.strategy,
              avgPnL: Number(avgPnL.toFixed(2)),
            };
          })
          .sort((a, b) => b.avgPnL - a.avgPnL);

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
        Strategy Efficiency (Avg PnL)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="strategy"
            width={130}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(val) => [Number(val).toFixed(2), "Avg PnL per Trade"]}
          />
          <Bar dataKey="avgPnL" radius={[0, 6, 6, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.avgPnL >= 0 ? "#22c55e" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
