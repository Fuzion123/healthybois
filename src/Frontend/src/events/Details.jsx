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
      <div className='my-1'>
      <ProgressBar progress={data.progress} />
      </div>

      <div className='my-3'>
        <ScoreBoard event={data}></ScoreBoard>
      <br/>
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
      <button onClick={() => history.navigate(`/events`)} className="mt bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded">Back</button>
        </> 
     
)
              }
              </div>



  )}