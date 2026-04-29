import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TradeOverviewPieChart from "./TradeOverviewPieChart";
import StrategySymbolChart from "./StrategySymbolChart";
import StrategyDirectionChart from "./StrategyDirectionChart";
import StrategyWinLossChart from "./StrategyWinLossChart";
import StrategyWinRateChart from "./StrategyWinRateChart";
import StrategyEfficiencyChart from "./StrategyEffiencyChart";
import StrategyUsageChart from "./StrategyUsuageChart";
import InsightPanel from "./InsightPanel";
import { authApi } from "../../api";

export default function UserHomepage({ username }) {
  const [totalTradesAnalysis, setTotalTradesAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchTotalAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authApi.get(`/api/trades/total_win_and_loss`)

      const data = response.data;

      console.log("response status:", response.status);
      console.log("response data:", data);


      setTotalTradesAnalysis(data);
    } catch (error) {
      console.error("Error fetching trade analysis:", error);
      setError(error.response?.data?.message||error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalAnalysis();
  }, []);

  const totalTrades = totalTradesAnalysis?.data?.total;
  const hasNoTrades =
    !loading && !error && totalTradesAnalysis && totalTrades === 0;

  return (
    <section className="user-homepage">
      <h1 className="user-homepage__title">Welcome {username}!</h1>

      {loading && <p className="user-homepage__status">Loading analysis...</p>}

      {error && (
        <div className="user-homepage__error-box">
          <p>Something went wrong</p>
          <span>{error}</span>
        </div>
      )}

      {hasNoTrades ? (
        <div className="user-homepage__empty-state">
          <h2 className="user-homepage__empty-title">No trades yet</h2>
          <p className="user-homepage__empty-text">
            Start adding your trades to unlock your dashboard insights.
          </p>
          <button
            className="user-homepage__empty-button"
            onClick={() => navigate("/create-trade")}
          >
            Add Your First Trade
          </button>
        </div>
      ) : (
        !loading &&
        !error &&
        totalTradesAnalysis?.data && (
          <div className="user-homepage__charts">
            <TradeOverviewPieChart analysis={totalTradesAnalysis} />
            <InsightPanel />
            <StrategySymbolChart />
            <StrategyDirectionChart />
            <StrategyWinRateChart />
            <StrategyWinLossChart />
            <StrategyEfficiencyChart />
            <StrategyUsageChart />
          </div>
        )
      )}
    </section>
  );
}
