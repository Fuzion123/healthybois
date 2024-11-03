import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { eventapi } from "_api";
// import { date } from "_helpers";
import ProgressBar from "_components/ProgressBar";
import OldActivityList from "../activities/list/OldActivityList";
// import ScoreBoard from '_components/Scoreboard';
import { history } from "_helpers";
// import ScoreboardSummary from "_components/ScoreboardSummary";
import { Header } from "_components/Header";
import { Settings } from "events/detail/Settings";
import ScoreBoardv2 from "_components/Scoreboardv2";

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

          <div className="my-4">
            <img
              src={data.eventPictureUrl}
              alt="yo"
              className="object-cover w-full h-40 md:h-72 rounded-t-lg"
            />
          </div>

          <div className="my-2">
            <ProgressBar progress={data.progress} />
          </div>

          <div className="my-4">
            <ScoreBoardv2 eventId={data.id}></ScoreBoardv2>
          </div>

          <OldActivityList activities={data.activities} />
        </>
      )}
    </div>
  );
}
