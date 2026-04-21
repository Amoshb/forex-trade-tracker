import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function TradeOverviewPieChart({ analysis }) {
  const summary = analysis?.data || {};
  const total = summary?.total || 0;

  const chartData = [
    { name: "Wins", value: summary?.win || 0 },
    { name: "Losses", value: summary?.loss || 0 },
    { name: "Breakeven", value: summary?.breakeven || 0 },
  ].filter((item) => item.value > 0);

  const COLORS = ["#22c55e", "#ef4444", "#facc15"];

  return (
    <div className="user-homepage-chart-card">
      <h2 className="user-homepage-chart-card__title">Trade Results</h2>

      <div className="user-homepage-chart-card__stats">
        <div className="user-homepage-chart-card__stat">
          <p>Total</p>
          <h3>{total}</h3>
        </div>

        <div className="user-homepage-chart-card__stat">
          <p>Win Rate</p>
          <h3>{analysis?.profitPercentage || 0}%</h3>
        </div>

        <div className="user-homepage-chart-card__stat">
          <p>Loss Rate</p>
          <h3>{analysis?.lossPercentage || 0}%</h3>
        </div>
      </div>

      <div className="user-homepage-chart-card__chart-wrapper">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={82}
              dataKey="value"
              nameKey="name"
              label={false}
              labelLine={false}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => {
                const percentage =
                  total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return [`${value} trades (${percentage}%)`, name];
              }}
            />

            <Legend verticalAlign="bottom" height={30} />
          </PieChart>
        </ResponsiveContainer>

        <div className="user-homepage-chart-card__center-text">
          <span className="user-homepage-chart-card__center-value">
            {total}
          </span>
          <span className="user-homepage-chart-card__center-label">Trades</span>
        </div>
      </div>
    </div>
  );
}
