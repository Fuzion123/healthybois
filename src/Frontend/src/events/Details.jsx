import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { eventapi } from "_api";
import { date } from "_helpers";
import ProgressBar from "_components/ProgressBar";
import ActivityList from "./activities/ActivityList";
// import ScoreBoard from '_components/Scoreboard';
import { history } from "_helpers";
import ScoreboardSummary from "_components/ScoreboardSummary";

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
          <div className="flex flex-row justify-between text-base/6">
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <time dateTime={data.startsAt} className="text-sm text-gray-500">
              {date.formatDate(data.startsAt)}
            </time>
          </div>
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
          <button
            onClick={() => history.navigate(`/events`)}
            className="btn-back"
          >
            <div className="flex justify-center">
              <p className="">Back</p>
            </div>
          </button>
        </>
      )}
    </div>
  );
}
