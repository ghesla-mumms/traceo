import { localStorageService } from "../../../lib/localStorage";
import { LocalStorage } from "../../../lib/localStorage/types";
import dateUtils from "../../../utils/date";
import { IEvent } from "@traceo/types";
import { FC, useEffect } from "react";
import { BaseChart } from "../BaseChart";
import { BaseTooltip } from "../BaseTooltip";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import { LoadingOutlined } from "@ant-design/icons";
import { useReactQuery } from "../../../hooks/useReactQuery";
import { theme } from "src/core/utils/theme";

interface Props {
  id: string;
}

const IncidentsListChart: FC<Props> = ({ id }) => {
  const plotType = localStorageService.get<any>(LocalStorage.PlotType) || "bar";

  const { data: groupedEvents = [], isLoading } = useReactQuery<IEvent[]>({
    queryKey: [`grouped_events_${id}`],
    url: `/api/event/incident/${id}/grouped`
  });

  if (isLoading) {
    return (
      <div className="w-full text-center justify-center">
        <LoadingOutlined />
      </div>
    );
  }

  return (
    <BaseChart
      height="40px"
      dataset={{
        source: groupedEvents || []
      }}
      tooltip={BaseTooltip()}
      grid={{
        left: "30px",
        right: "10px",
        top: "10px",
        bottom: "10px"
      }}
      xAxis={BaseXAxis({
        show: false,
        pointerFormatter: (v) => dateUtils.formatDate(Number(v), "MMM D, YYYY")
      })}
      yAxis={BaseYAxis({
        axisLabel: {
          showMinLabel: false,
          color: "#CCCCDC",
          fontSize: 10
        },
        min: 0,
        max: (e) => {
          return e.max;
        },
        interval: 99999
      })}
      series={{
        name: "Errors",
        type: plotType,
        color: theme.chart.incidents.timeline.color,
        showSymbol: false,
        itemStyle: {
          borderColor: theme.chart.incidents.timeline.color,
          borderWidth: 2
        },
        areaStyle: {
          color: theme.chart.incidents.timeline.color,
          opacity: theme.chart.incidents.timeline.areaOpacity
        },
        barWidth: theme.chart.incidents.timeline.barWidth,
        barGap: "5%"
      }}
    />
  );
};

export default IncidentsListChart;
