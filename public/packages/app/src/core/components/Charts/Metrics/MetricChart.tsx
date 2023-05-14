import { useProject } from "../../../hooks/useProject";
import { ConditionalWrapper } from "../../ConditionLayout";
import { DataNotFound } from "../../DataNotFound";
import { buildSeries } from "./utils";
import { IMetric, METRIC_UNIT, MetricResponseType } from "@traceo/types";
import { FC, useEffect } from "react";
import { BaseChart } from "../BaseChart";
import { BaseXAxis } from "../BaseXAxis";
import dayjs from "dayjs";
import { BaseYAxis } from "../BaseYAxis";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";

interface Props {
  metric: IMetric;
  ranges: [number, number];
}
const MetricChart: FC<Props> = ({ metric, ranges }) => {
  const { project } = useProject();

  const seriesFields = metric.series.map(({ field }) => field) || [""];
  const {
    data: datasource,
    refetch,
    isFetching
  } = useReactQuery<MetricResponseType>({
    queryKey: [`metric_ds_${metric.id}`],
    url: `/api/metrics/${project?.id}/datasource`,
    params: {
      fields: seriesFields,
      from: ranges[0],
      to: ranges[1]
    }
  });

  useEffect(() => {
    refetch();
  }, [ranges, metric]);

  return (
    <ConditionalWrapper
      isLoading={isFetching}
      isEmpty={!datasource || datasource?.time?.length === 0}
      emptyView={<DataNotFound className="text-2xs" label="Data not found" />}
    >
      <BaseChart
        height="150px"
        renderer="canvas"
        xAxis={BaseXAxis({
          offset: 12,
          axisLabel: {
            formatter: (v: string) => dayjs.unix(Number(v)).format("HH:mm"),
            fontSize: 11,
            showMaxLabel: true
          },
          pointerFormatter: (v: unknown) => dayjs(Number(v)).format("HH:mm, DD MMM"),
          data: datasource?.time
        })}
        yAxis={BaseYAxis({
          axisLabel: {
            formatter: `{value} ${metric.unit === METRIC_UNIT.NONE ? "" : metric.unit}`
          },
          minInterval: 1
        })}
        dataZoom={{
          type: "inside",
          xAxisIndex: [0],
          zoomOnMouseWheel: false,
          zoomLock: true,
          throttle: 50
        }}
        grid={{
          containLabel: true,
          right: 20,
          left: 10,
          bottom: 15,
          top: 10
        }}
        series={buildSeries(metric.series, metric, datasource, "card")}
      />
    </ConditionalWrapper>
  );
};

export default MetricChart;
