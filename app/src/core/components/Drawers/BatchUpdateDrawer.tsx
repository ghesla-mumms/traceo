import { Drawer, Form, Select, Space } from "antd";
import { FC, useState } from "react";
import { IncidentStatus } from "../../../types/incidents";
import { isEmptyObject } from "../../../core/utils/object";
import { toTitleCase } from "../../../core/utils/stringUtils";
import { DrawerButtons } from "../DrawerButtons";
import { dispatch } from "../../../store/store";
import { batchUpdate } from "../../../features/app/incidents/state/actions";

interface Props {
  incidentsIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const BatchUpdateDrawer: FC<Props> = ({ incidentsIds, isOpen, onClose }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const update = () => {
    setLoading(true);

    const update = form.getFieldsValue();
    if (isEmptyObject(update)) {
      setLoading(false);
      return;
    }

    dispatch(batchUpdate({ incidentsIds, update }));
    onClose();
    setLoading(false);
  };

  return (
    <Drawer
      title="Batch update"
      onClose={onClose}
      visible={isOpen}
      closable={false}
      footer={<DrawerButtons onClose={onClose} onFinish={update} loading={isLoading} />}
    >
      <Space direction="vertical" className="w-full">
        <Form form={form} layout="vertical">
          <Form.Item name="status" label="Status">
            <Select showArrow className="capitalize">
              {Object.values(IncidentStatus).map((status, index) => (
                <Select.Option key={index} value={status}>
                  {toTitleCase(status)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Space>
    </Drawer>
  );
};