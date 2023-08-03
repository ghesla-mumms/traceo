import { ProjectMembersTable } from "../../../../core/components/ProjectMembersTable";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { ProjectMember, isEmpty } from "@traceo/types";
import { Space, Typography, Card } from "@traceo/ui";
import { useParams } from "react-router-dom";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";

export const AdminProjectMembers = () => {
  const { id } = useParams();

  const {
    data: members = [],
    isLoading,
    refetch
  } = useReactQuery<ProjectMember[]>({
    queryKey: [`members_${id}`],
    url: "/api/member/search",
    params: { id }
  });

  return (
    <Card title="Project members">
      <ConditionalWrapper
        isEmpty={isEmpty(members)}
        emptyView={
          <Space className="w-full justify-center">
            <Typography className="w-full justify-center">No members</Typography>
          </Space>
        }
        isLoading={isLoading}
      >
        <ProjectMembersTable collection={members} postExecute={() => refetch()} />
      </ConditionalWrapper>
    </Card>
  );
};
