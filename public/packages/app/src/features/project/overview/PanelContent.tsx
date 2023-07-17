import { conditionClass } from "@traceo/ui";
import { OptionsCollapseGroup } from "../explore/components/OptionsCollapseGroup";
import { PanelDatasourceTable } from "./components/PanelDatasourceTable";
import { PanelCustomizeForm } from "./components/PanelEditor/PanelCustomizeForm";
import { PanelSeriesCustomizeForm } from "./components/PanelEditor/PanelSeriesCustomizeForm";
import { QueryResponseType } from "./utils";
import { DashboardPanel, VISUALIZATION_TYPE } from "@traceo/types";
import { DraftFunction } from "use-immer";
interface Props {
  isCustomizeMode?: boolean;
  isRawDataPreview?: boolean;
  isLoading?: boolean;
  isLoadingRaw?: boolean;
  renderPanel: () => void;
  data?: QueryResponseType;
  rawData?: any[];
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}
export const PanelContent = ({
  isCustomizeMode = false,
  isLoading = false,
  isLoadingRaw = false,
  isRawDataPreview = false,
  renderPanel = undefined,
  data = {
    datasource: [],
    options: undefined
  },
  rawData = [],
  options = undefined,
  setOptions = undefined
}: Props) => {
  const hasSeries = ![VISUALIZATION_TYPE.TEXT, VISUALIZATION_TYPE.STAT].includes(
    options.config.visualization
  );

  return (
    <div className="w-full grid grid-cols-12">
      {isCustomizeMode && hasSeries && (
        <div className="col-span-3">
          <PanelSeriesCustomizeForm
            data={data?.datasource}
            setOptions={setOptions}
            options={options}
          />
        </div>
      )}
      <div
        className={conditionClass(
          isCustomizeMode,
          `col-span-${!hasSeries ? "9" : "6"} mx-1`,
          "col-span-12"
        )}
      >
        {renderPanel()}
        {isRawDataPreview && !isCustomizeMode && (
          <OptionsCollapseGroup
            title="Raw data"
            loading={isLoading}
            extra={
              <span className="text-xs font-semibold text-primary">
                {(rawData || []).length} rows found
              </span>
            }
          >
            <PanelDatasourceTable panel={options} metricData={rawData} isLoading={isLoadingRaw} />
          </OptionsCollapseGroup>
        )}
      </div>
      {isCustomizeMode && (
        <div className="col-span-3">
          <PanelCustomizeForm data={data?.datasource} setOptions={setOptions} options={options} />
        </div>
      )}
    </div>
  );
};
