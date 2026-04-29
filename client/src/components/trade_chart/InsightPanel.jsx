import { useEffect, useMemo, useState } from "react";
import { authApi } from "../../api";

export default function InsightPanel() {
  const [strategyData, setStrategyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStrategyStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authApi.get(
        `/api/trades/trade_stats?groupBy=strategy`,
      );

      const data = response.data;

      setStrategyData(data.data || []);
    } catch (error) {
      console.error("Error fetching strategy insights:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategyStats();
  }, []);

  const insights = useMemo(() => {
    if (!strategyData.length) return null;

    const enriched = strategyData.map((item) => {
      const tradeCount = item.trade_count || 0;
      const winCount = item.win_count || 0;
      const totalPnL = item.totalPnL || 0;

      const winRate = tradeCount > 0 ? (winCount / tradeCount) * 100 : 0;
      const avgPnL = tradeCount > 0 ? totalPnL / tradeCount : 0;

      return {
        strategy: item.strategy,
        tradeCount,
        winCount,
        totalPnL,
        winRate,
        avgPnL,
      };
    });

    const bestStrategy = [...enriched].sort(
      (a, b) => b.totalPnL - a.totalPnL,
    )[0];
    const weakestStrategy = [...enriched].sort(
      (a, b) => a.totalPnL - b.totalPnL,
    )[0];
    const mostConsistent = [...enriched].sort(
      (a, b) => b.winRate - a.winRate,
    )[0];
    const mostEfficient = [...enriched].sort((a, b) => b.avgPnL - a.avgPnL)[0];
    const mostUsed = [...enriched].sort(
      (a, b) => b.tradeCount - a.tradeCount,
    )[0];

    return {
      bestStrategy,
      weakestStrategy,
      mostConsistent,
      mostEfficient,
      mostUsed,
    };
  }, [strategyData]);

  if (loading) {
    return (
      <div className="user-homepage-chart-card insight-panel">
        <h2 className="user-homepage-chart-card__title">Insights</h2>
        <p className="user-homepage-chart-card__message">Loading insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-homepage-chart-card insight-panel">
        <h2 className="user-homepage-chart-card__title">Insights</h2>
        <p className="user-homepage-chart-card__message user-homepage-chart-card__message--error">
          {error}
        </p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="user-homepage-chart-card insight-panel">
        <h2 className="user-homepage-chart-card__title">Insights</h2>
        <div className="user-homepage-chart-card__empty">
          <p>No insights yet</p>
          <span>Add more trades to generate strategy insights</span>
        </div>
      </div>
    );
  }

  return (
    <div className="user-homepage-chart-card insight-panel">
      <h2 className="user-homepage-chart-card__title">Insights</h2>

      <div className="insight-panel__list">
        <div className="insight-panel__item">
          <span className="insight-panel__label">Best Strategy</span>
          <strong className="insight-panel__value">
            {insights.bestStrategy.strategy}
          </strong>
          <small className="insight-panel__subvalue">
            Net PnL: {insights.bestStrategy.totalPnL.toFixed(2)}
          </small>
        </div>

        <div className="insight-panel__item">
          <span className="insight-panel__label">Most Consistent</span>
          <strong className="insight-panel__value">
            {insights.mostConsistent.strategy}
          </strong>
          <small className="insight-panel__subvalue">
            Win Rate: {insights.mostConsistent.winRate.toFixed(1)}%
          </small>
        </div>

        <div className="insight-panel__item">
          <span className="insight-panel__label">Most Efficient</span>
          <strong className="insight-panel__value">
            {insights.mostEfficient.strategy}
          </strong>
          <small className="insight-panel__subvalue">
            Avg PnL: {insights.mostEfficient.avgPnL.toFixed(2)}
          </small>
        </div>

        <div className="insight-panel__item">
          <span className="insight-panel__label">Most Used</span>
          <strong className="insight-panel__value">
            {insights.mostUsed.strategy}
          </strong>
          <small className="insight-panel__subvalue">
            Trades: {insights.mostUsed.tradeCount}
          </small>
        </div>

        <div className="insight-panel__item insight-panel__item--warning">
          <span className="insight-panel__label">Weakest Strategy</span>
          <strong className="insight-panel__value">
            {insights.weakestStrategy.strategy}
          </strong>
          <small className="insight-panel__subvalue">
            Net PnL: {insights.weakestStrategy.totalPnL.toFixed(2)}
          </small>
        </div>
      </div>
    </div>
  );
}
