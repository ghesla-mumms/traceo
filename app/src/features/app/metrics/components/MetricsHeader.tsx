import { LoadingOutlined } from "@ant-design/icons";
import { Segmented, Space } from "antd";
import { FC } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";
import { CONNECTION_STATUS } from "types/tsdb";

interface Props {
  loading: boolean;
  hrCount: number;
  setHrCount: (val: number) => void;
}
export const MetricsHeader: FC<Props> = ({ hrCount, setHrCount, loading }) => {
  const { application } = useSelector((state: StoreState) => state.application);
  const isConnected = application?.influxDS?.connStatus === CONNECTION_STATUS.CONNECTED;
  return (
    // <PagePanel title="Criteria">
    <Space className="w-full justify-end">
      {isConnected && (
        <Space>
          {loading && <LoadingOutlined className="mr-5" />}
          <Segmented
            defaultValue={hrCount}
            options={[
              { value: 1, label: "1h" },
              { value: 3, label: "3h" },
              { value: 6, label: "6h" },
              { value: 12, label: "12h" },
              { value: 24, label: "24h" },
              { value: 48, label: "2d" },
              { value: 72, label: "3d" }
            ]}
            onChange={(v) => setHrCount(v as number)}
          />
        </Space>
      )}
    </Space>
    // </PagePanel>
  );
};
