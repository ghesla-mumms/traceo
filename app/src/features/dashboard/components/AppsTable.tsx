import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, Menu, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { ConditionLayout } from "../../../core/components/ConditionLayout";
import { EmptyAppList } from "../../../core/components/EmptyViews/EmptyAppList";
import { SearchInput } from "../../../core/components/SearchInput";
import { SortIcons } from "../../../core/components/SortIcons";
import { SortOrder } from "../../../types/api";
import { SearchApplicationQueryParams } from "../../../types/application";
import { AppsSortBy, handleAppSort } from "../../../core/utils/handlers";
import { dispatch } from "../../../store/store";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { CreateApplicationDrawer } from "../../../core/components/Drawers/CreateApplicationDrawer";
import { AppCard } from "./AppCard";
import { loadApplications } from "../state/actions";
import ServerPermissions from "../../../core/components/ServerPermissions";

export const AppsTable = () => {
  const { applications, hasFetched } = useSelector(
    (state: StoreState) => state.applications
  );
  const { account } = useSelector((state: StoreState) => state.account);

  const [order, setOrder] = useState<SortOrder>("ASC");
  const [search, setSearch] = useState<string>(null);
  const [sortBy, setSortBy] = useState<AppsSortBy>(AppsSortBy.LAST_INCIDENT);
  const [openApplicationModal, setOpenApplicationModal] = useState<boolean>(false);
  // const [openEditChartsModal, setOpenEditChartsModal] = useState<boolean>(false);

  const queryParams: SearchApplicationQueryParams = {
    order,
    sortBy,
    search: search,
    accountId: account?.id
  };

  useEffect(() => fetchApplications(), []);
  useEffect(() => fetchApplications(), [order, sortBy, search]);
  const fetchApplications = () => dispatch(loadApplications(queryParams));

  const onSearch = (val: string) => setSearch(val);

  const AppsSortDropdown = () => {
    const statusContent = (
      <Menu style={{ width: 200 }} onClick={(val) => setSortBy(val.key as AppsSortBy)}>
        <Menu.Item key={AppsSortBy.LAST_INCIDENT}>Last incident</Menu.Item>
        <Menu.Item key={AppsSortBy.CREATED_AT}>Created at</Menu.Item>
        <Menu.Item key={AppsSortBy.LAST_UPDATE}>Last update</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={statusContent} placement="bottom">
        <Button>
          <span>Sort by:</span>
          <span className="font-bold">&nbsp;{handleAppSort[sortBy]}</span>
        </Button>
      </Dropdown>
    );
  };

  const SearchHeader = () => (
    <Space className="w-full justify-between">
      <Space>
        <SearchInput placeholder="Search by name" value={search} setValue={onSearch} />
        <AppsSortDropdown />
        <SortIcons order={order} setOrder={setOrder} />
        {/* <SettingOutlined
          onClick={() => setOpenEditChartsModal(true)}
          className="action-icon"
        /> */}
      </Space>
      <ServerPermissions>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setOpenApplicationModal(true)}
          type="primary"
        >
          Create new app
        </Button>
      </ServerPermissions>
    </Space>
  );

  return (
    <>
      <SearchHeader />
      <ConditionLayout
        isLoading={!hasFetched}
        isEmpty={applications?.length === 0}
        emptyView={<EmptyAppList constraints={search} />}
      >
        <Row className="pt-5" gutter={[8, 24]}>
          {applications?.map((app, index) => (
            <Col key={index} span={8}>
              <AppCard app={app} />
            </Col>
          ))}
        </Row>
      </ConditionLayout>
      <CreateApplicationDrawer
        isOpen={openApplicationModal}
        onCancel={() => setOpenApplicationModal(false)}
      />
      {/* <EditChartsDrawer
        isOpen={openEditChartsModal}
        onCancel={() => setOpenEditChartsModal(false)}
      /> */}
    </>
  );
};