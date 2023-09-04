import { useParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import {useQuery, useMutation } from 'react-query';
import { eventapi } from '_api';
import { history, date } from '_helpers';
import ProgressBar from '_components/ProgressBar';
import ParticipantBar from '_components/ParticipantBar';
import ActivityList from './activities/ActivityList'
import { Link } from 'react-router-dom';

export default  EventDetails;

function EventDetails() {
  const { id } = useParams();
 

  // query
  const {data, error, isLoading} = useQuery('getById', () => {
    return eventapi.getById(id);
  },{
    onSuccess: () => {
      console.log(data)
    }
  }
  );

  const profiles = [
    { profilePictureUrl: data.participants.profilePictureUrl },
    { profilePictureUrl: 'profile2.jpg' },
    { profilePictureUrl: 'profile3.jpg' },
  ];

  const mutation = useMutation(async (id) => {
    await eventapi.deleteById(id)
  }, {
    onSuccess: () => {
      history.navigate('/events');
    }
  });

  if (error) return <div>Request Failed</div>;

  if (isLoading) return <div>Loading...</div>;

const submit = (event) => {
  confirmAlert({
    title: <span className="confirm-title">Confirm to delete</span>,
    message: <span className="confirm-message">Are you sure?</span>,
    buttons: [
      {
        label: 'Yes',
        className: 'confirm-button',
        onClick: () => mutation.mutate(event.id)
      },
      {
        label: 'No',
        className: 'confirm-button',
        //onClick: () => alert('Click No')
      }
    ],
    containerProps: { 
      style: {
        zIndex: 9999, 
        position: 'absolute', 
        top: '20px', 
        left: '50%',
        transform: 'translateX(-50%)' // center the dialog horizontally
      }
    }
  });
}

return (
  <div>
    {(data) && (
    <><div className="flex flex-row justify-between text-base/6">
        <div className='text-2xl'>{data.title}</div>
        <time dateTime={data.startsAt} className="text-sm text-base/8 text-gray-500">
          {date.formatDate(data.startsAt)}
        </time>
      </div>
      <div className='my-1'>
      <ProgressBar progress={37} />
      </div>

      <div className='my-3'>
        <p>Scoreboard</p>
      </div>
      <div className='my-3'>
      <ParticipantBar profiles={profiles} />
      </div>
      <div>
        
      <div className='my-2'>
          <ActivityList activities={data.activities} />
          </div>
        </div>
        <div>
          <button onClick={() => submit(data)} className="my-3 btn btn-sm btn-danger mx-2" disabled={data.isDeleting}>
            <span>Delete</span>
          </button>
          <Link to={`/events/${id}/addActivity`} className="my-3 btn btn-sm mx-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-green-400">Add Activity</Link>
        </div></> 
     
)
              }
              </div>



  )}