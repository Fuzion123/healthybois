import { activityapi } from "_api";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import ActivityResult from "./ActivityResult";
import { history } from '_helpers';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { alertActions } from "_store";

export default ActivityDetails;

function ActivityDetails() {
  const dispatch = useDispatch();
  const { activityId } = useParams();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, error, isLoading } = useQuery(`/activityapi.getById/${id}/${activityId}`, async () => {
    return await activityapi.getById(id, activityId);
  }, {
    onSuccess: (d) => {
    }
  }
  );

  const mutation = useMutation(async () => {
    await activityapi.deleteById(id, activityId)
  }, {
    onSuccess: () => {
      setIsProcessing(false);
      history.navigate(`/events/${id}`);
    },
    onError: (err) => {
      dispatch(alertActions.clear());
      dispatch(alertActions.error(err));
      setIsProcessing(false)
      queryClient.invalidateQueries({ queryKey: [`scoreboard/${id}`] })

    }
  });

  const toggleCompleteMutation = useMutation(async (val) => {
    if(val === true){
      await activityapi.markUnDone(id, activityId);
    }
    else{
      await activityapi.markDone(id, activityId);
    }
  }, {
    onSuccess: () => {
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: [`/activityapi.getById/${id}/${activityId}`] })
    },
    onError: (err) => {
      dispatch(alertActions.clear());
      dispatch(alertActions.error(err));
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: [`/activityapi.getById/${id}/${activityId}`] })
    }
  });

  async function toggleComplete(val){
    setIsProcessing(true);
    toggleCompleteMutation.mutate(val);
  }

  function goBack(){
    queryClient.invalidateQueries({ queryKey: [`/activityapi.getById/${id}/${activityId}`] })
    
    history.navigate(`/events/${id}`);
  }

  async function deleteActivity(){
    setIsProcessing(true);
    mutation.mutate();
  }

  if (error) return <div>Request Failed</div>;

  if (isLoading) return <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>;

  return (
    <div className="">
      <section className="mb-8 relative">
        <h1 className="text-5xl font-bold"><span>{data.title}</span></h1>
        {isProcessing ? (<div style={{position: 'absolute', right: '0px'}} className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>) : (<></>)}
        <br></br>
        {!isLoading && 
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" onChange={() => toggleComplete(data.completed)} checked={data.completed} value="" className="sr-only peer"/>
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-m font-medium text-black-300">Completed</span>
          </label>
        }
        <br></br>
        <br></br>
        <h4 className="text-x3 font-bold mb-2">Results</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.participants.map((p, i) => {
            return (
              <div key={p.participant.id} className="">
                <ActivityResult eventId={id} activityId={activityId} participant={p.participant} result={p.result} isProcessing={isProcessing} setIsProcessing={setIsProcessing}/>
              </div>
            )
          })}
        </div>
        <button disabled={isProcessing} onClick={() => goBack()} className="mt-6 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"> Ok </button>
        <button disabled={isProcessing} onClick={() => deleteActivity()} className="ml-6 mt-6 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"> Delete </button>
      </section>

    </div>
  );

}