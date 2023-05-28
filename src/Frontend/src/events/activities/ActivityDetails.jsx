import { activityapi } from "_api";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ActivityResult from "./ActivityResult";

export default ActivityDetails;

function ActivityDetails() {
  const { activityId } = useParams();
  const { id } = useParams();

  // query
  const { data, error, isLoading } = useQuery(`/activityapi.getById/${id}`, () => {
    return activityapi.getById(id, activityId);
  }, {
    onSuccess: (d) => {
    }
  }
  );

  if (error) return <div>Request Failed</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">{data.title}</h2>
        <h4 className="text-x3 font-bold mb-2">Results</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.participants.map((p, i) => {
            return (
              <div key={i} className="">
                <p className="">{p.participant.firstName}</p>
                <ActivityResult eventId={id} activityId={activityId} participant={p.participant} result={p.result}/>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  );

}