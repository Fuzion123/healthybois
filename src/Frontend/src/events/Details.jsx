import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { eventapi } from "_api";
// import { date } from "_helpers";
import ProgressBar from "_components/ProgressBar";
import ActivityList from "./activities/ActivityList";
// import ScoreBoard from '_components/Scoreboard';
import { history } from "_helpers";
import ScoreboardSummary from "_components/ScoreboardSummary";
import { Header } from "_components/Header";
import { EventDetailsSettings } from "events/EventDetailsSettings";

export default EventDetails;

function EventDetails() {
  const { id } = useParams();

  // query
  const { data, error, isLoading } = useQuery(`/getById/${id}`, async () => {
    return await eventapi.getById(id);
  });

  if (error) return <div>Request Failed</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data && (
        <>
          <Header
            className="flex flex-row justify-between text-base/6"
            title={data.title}
            overwriteClickHandler={() => history.navigate("/events")}
            settings={<EventDetailsSettings event={data} />}
          >
            {/* <time dateTime={data.startsAt} className="text-sm text-gray-500">
              {date.formatDate(data.startsAt)}
            </time> */}
          </Header>

          <div className="my-2">
            <ProgressBar progress={data.progress} />
          </div>

          <div className="my-4">
            <ScoreboardSummary event={data}></ScoreboardSummary>
          </div>

          <div>
            <div className="my-2">
              <ActivityList activities={data.activities} />
              <button
                onClick={() => history.navigate(`/events/${id}/addActivity`)}
                className="mt-3 btn-primary"
              >
                Add Activity
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
