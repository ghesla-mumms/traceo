import { Space, Typography, Switch, Table } from "antd";
import { PagePanel } from "core/components/PagePanel";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { MetricsResponse } from "types/tsdb";

interface Props {
  metrics: MetricsResponse[];
  columns: any[];
}
export const MetricTableWrapper: FC<Props> = ({ columns, metrics }) => {
  const [isFormattedTime, setFormattedTime] = useState<boolean>(true);

  const cols = [
    {
      title: "Time",
      dataIndex: "time",
      render: (time: string) =>
        isFormattedTime ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : time
    }
  ];

  return (
    <PagePanel className="py-3 px-5">
      <Space className="w-full justify-between" direction="vertical">
        <Space className="w-full justify-between mb-12">
          <Typography.Text className="font-semibold">Raw data</Typography.Text>
          <Space>
            <Typography.Text className="text-md">Formatted time</Typography.Text>
            <Switch
              defaultChecked={isFormattedTime}
              onClick={() => setFormattedTime(!isFormattedTime)}
            />
          </Space>
        </Space>
        <Table
          dataSource={metrics}
          columns={[...cols, ...columns]}
          pagination={{ pageSize: 150 }}
          scroll={{ y: 440 }}
        />
      </Space>
    </PagePanel>
  );
};
