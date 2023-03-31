import { StoreState } from "@store/types";
import { Card, Link } from "@traceo/ui";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IncidentTimelineChart from "../../../../core/components/Charts/Incidents/IncidentTimelineChart";

export const TimelineSection = () => {
  const { incident, events } = useSelector((state: StoreState) => state.incident);
  const { project } = useSelector((state: StoreState) => state.project);

  const navigate = useNavigate();

  return (
    <Card
      title="Timeline"
      className="h-auto"
      extra={
        <Link
          onClick={() => navigate(`/project/${project.id}/incidents/${incident.id}/analytics`)}
          className="text-xs font-semibold"
        >
          More
        </Link>
      }
    >
      <IncidentTimelineChart events={events} />
    </Card>
  );
};