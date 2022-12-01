import { StatCards } from "./StatCards";
import { useApi } from "../../../../core/lib/useApi";
import { SyncOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { PagePanel } from "../../../../core/components/PagePanel";
import { IncidentsOverviewPlot } from "../../../../core/components/Plots/components/IncidentsOverviewPlot";
import { AppIncidentsStats } from "../../../../types/statistics";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { dispatch } from "../../../../store/store";
import { loadApplication } from "../../../../features/app/state/actions";
import { ConditionLayout } from "../../../../core/components/ConditionLayout";
import { ErrorDetails } from "../../../../types/incidents";

export const OverviewSection = () => {
  const { id } = useParams();

  const {
    data: stats = [],
    isLoading,
    execute: get
  } = useApi<ErrorDetails[]>({
    url: "/api/statistics/total",
    params: {
      id
    }
  });

  const {
    data: cardStats,
    isLoading: loadingCardStats,
    execute: getCardStats
  } = useApi<AppIncidentsStats>({
    url: "/api/statistics",
    params: {
      id
    }
  });

  const refresh = () => {
    get();
    getCardStats();
    dispatch(loadApplication());
  };

  return (
    <>
      <PagePanel
        title="App overview"
        extra={<SyncOutlined className="text-xs" onClick={() => refresh()} />}
      >
        <StatCards stats={cardStats} isLoading={loadingCardStats} />
        <ConditionLayout
          isLoading={isLoading && loadingCardStats}
          isEmpty={stats?.length === 0}
          emptyView={<DataNotFound label="Incidents metrics not found" />}
        >
          <IncidentsOverviewPlot stats={stats} />
        </ConditionLayout>
      </PagePanel>
    </>
  );
};
