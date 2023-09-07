import { activityapi } from "_api";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import ActivityResult from "./ActivityResult";
import { history } from '_helpers';
// import { history } from '_helpers';

export default ActivityDetails;

function ActivityDetails() {
  const { activityId } = useParams();
  const { id } = useParams();
  const queryClient = useQueryClient();
  // query



  const { data, error, isLoading } = useQuery(`/activityapi.getById/${id}/${activityId}`, () => {
    return activityapi.getById(id, activityId);
  }, {
    onSuccess: (d) => {
    }
  }
  );

  async function toggleComplete(val){
    if(val === true){
      await activityapi.markUnDone(id, activityId);
    }
    else{
      await activityapi.markDone(id, activityId);
    }

    queryClient.invalidateQueries({ queryKey: [`/activityapi.getById/${id}/${activityId}`] })
    //history.navigate(`/events/${id}`);
  }

  function goBack(){
    queryClient.invalidateQueries({ queryKey: [`/activityapi.getById/${id}/${activityId}`] })
    
    history.navigate(`/events/${id}`);
  }

  if (error) return <div>Request Failed</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <section className="mb-8">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"><span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">{data.title}</span></h1>
        {!isLoading && 
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" onChange={() => toggleComplete(data.completed)} checked={data.completed} value="" className="sr-only peer"/>
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Complete</span>
          </label>
        }
        <h4 className="text-x3 font-bold mb-2">Results</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.participants.map((p, i) => {
            return (
              <div key={p.participant.id} className="">
                <ActivityResult eventId={id} activityId={activityId} participant={p.participant} result={p.result}/>
              </div>
            )
          })}
        </div>
        <button onClick={() => goBack()} className="my-3 btn btn-sm mx-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-yellow-400"> baaaack </button>
        {/* <Link to={`/events/${id}`} className="my-3 btn btn-sm mx-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-yellow-400" >back</Link> */}
      </section>

    </div>
  );

}