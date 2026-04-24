import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AdminUserActivityChart({ users }) {
  const chartData = users
    .filter((user) => user.role !== "admin")
    .map((user) => ({
      username: user.username,
      totalTrades: user.totalTrades || 0,
    }));

return (
  <div className="user-homepage-chart-card admin-activity-card">
    <h2 className="user-homepage-chart-card__title">User Trade Activity</h2>

    <ResponsiveContainer width="100%" height={340}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="username"
          width={100}
          tick={{ fontSize: 12 }}
        />
        <Tooltip />
        <Bar dataKey="totalTrades" fill="#3b82f6" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
}
