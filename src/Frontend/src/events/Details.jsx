import { useParams } from 'react-router-dom';
import {useQuery } from 'react-query';
import { eventapi } from '_api';
import { date } from '_helpers';
import ProgressBar from '_components/ProgressBar';
import ParticipantBar from '_components/ParticipantBar';
import ActivityList from './activities/ActivityList'
import { Link } from 'react-router-dom';
import ScoreBoard from '_components/Scoreboard';

export default  EventDetails;

function EventDetails() {
  const { id } = useParams();
 

  // query
  const {data, error, isLoading} = useQuery('getById', () => {
    return eventapi.getById(id);
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
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">{data.title}</h1>
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
            <Link to={`/events/${id}/addActivity`} className="my-3 btn btn-sm mx-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-green-400">Add Activity</Link>
        </div>
      </div>
        
      <Link to={`/events`} className="mx-2 rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-yellow-400" >back</Link>
        </> 
     
)
              }
              </div>



  )}