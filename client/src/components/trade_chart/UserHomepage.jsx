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
import { useQuery } from "@tanstack/react-query";

export default function UserHomepage({ username }) {
  const navigate = useNavigate();

  const {data, isLoading, isError, error} = useQuery({
    queryKey: ["total_win_and_loss"],
    queryFn: async () => {
      const res = await authApi.get(`/api/trades/total_win_and_loss`);
      return res.data;
    },
  });


  const totalTrades = data?.total;
  const hasNoTrades =
    !isLoading && !isError && data && totalTrades === 0;

  return (
    <section className="user-homepage">
      <h1 className="user-homepage__title">Welcome {username}!</h1>

      {isLoading && (
        <p className="user-homepage__status">Loading analysis...</p>
      )}

      {isError && (
        <div className="user-homepage__error-box">
          <p>Something went wrong</p>
          <span>{error?.message}</span>
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
        !isLoading &&
        !isError &&
        data && (
          <div className="user-homepage__charts">
            <TradeOverviewPieChart analysis={data} />
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
