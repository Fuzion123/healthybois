import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { eventapi } from "_api";
import ProgressBar from "_components/ProgressBar";
import { history } from "_helpers";
import { Header } from "_components/Header";
import { Settings } from "events/detail/Settings";
import ScoreBoardv2 from "scoreboard/Scoreboardv2";
import ActivityList from "events/activities/list/ActivityList";

export default EventDetails;

function EventDetails() {
  const { id } = useParams();

  // query
  const { data, error, isLoading } = useQuery(
    `/getById/${id}`,
    async () => {
      return await eventapi.getById(id);
    },
    {
      onSuccess: (data) => {},
    }
  );

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
            settings={<Settings event={data} />}
          ></Header>

          <div className="my-2">
            <img
              src={data.eventPictureUrl}
              alt="yo"
              className="object-cover w-full h-40 md:h-72 rounded-t-lg"
            />
          </div>

          <div className="my-2">
            <ProgressBar progress={data.progress} />
          </div>

          <div className="my-2">
            <ScoreBoardv2 eventId={data.id}></ScoreBoardv2>
          </div>

          <ActivityList activities={data.activities} />
        </>
      )}
    </div>
  );
}
