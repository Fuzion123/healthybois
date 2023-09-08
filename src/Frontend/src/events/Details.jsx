import { useParams } from 'react-router-dom';
import {useQuery } from 'react-query';
import { eventapi } from '_api';
import { date } from '_helpers';
import ProgressBar from '_components/ProgressBar';
import ActivityList from './activities/ActivityList'
import ScoreBoard from '_components/Scoreboard';
import { history } from '_helpers';

export default  EventDetails;

function EventDetails() {
  const { id } = useParams();
  // const queryClient = useQueryClient();

  // query
  const {data, error, isLoading} = useQuery(`/getById/${id}`, async () => {
    return await eventapi.getById(id);
  },{
    onSuccess: (d) => {
      
    }
  }
  );

  if (error) return <div>Request Failed</div>;

  if (isLoading) return <div>Loading...</div>;

return (
  <div>
    {(data) && (
    <>
    <div className="flex flex-row justify-between text-base/6">
        <h1 className='text-2xl font-bold'>{data.title}</h1>
        <time dateTime={data.startsAt} className="text-sm text-base/8 text-gray-500">
          {date.formatDate(data.startsAt)}
        </time>
      </div>
      <div className='my-2'>
      <ProgressBar progress={data.progress} />
      </div>

      <div className='my-2'>
        <ScoreBoard event={data}></ScoreBoard>
      </div>
      {/* <div className='my-3'>
      <ParticipantBar profiles={data.participants} />
      </div> */}
      <div>
        <div className='my-2'>
            <ActivityList activities={data.activities} />
            <button onClick={() => history.navigate(`/events/${id}/addActivity`)} className="mt-3 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Add Activity</button>
        </div>
      </div>
      <button onClick={() => history.navigate(`/events`)} className="flex flex-row mt bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded">
      <div class="flex flex-row align-middle">
        <svg class="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
        </svg>
        <p class="">back</p>
      </div>
      </button>
        </> 
     
)
              }
              </div>



  )}