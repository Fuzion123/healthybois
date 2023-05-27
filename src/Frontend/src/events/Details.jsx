import { useParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import {useQuery, useMutation } from 'react-query';
import { eventapi } from '_api';
import { history, date } from '_helpers';

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
    <div className="bg-white py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <img className='w-70 h-70 md:w-70 md:h-70' src= {data.eventPictureUrl} alt='EventImage'></img>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <article key="event details"className="flex max-w-xl flex-col items-start justify-between">
            <div className="flex items-center gap-x-4 text-xs">
              <time dateTime={data.startsAt} className="text-gray-500">
              {date.formatDate(data.startsAt)}
              </time>
              <p className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                Endurance
              </p>
            </div>
            <div className="group relative">
              <h1 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <span className="absolute inset-0" />
                {data.title}
              </h1>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{data.description}</p>
            </div>
            <div className="relative mt-8 flex items-center gap-x-4">
              <img src={data.eventOwner.profilePictureUrl} alt="Profile Pic" className="h-10 w-10 rounded-full bg-gray-50" />
              <div className="text-sm leading-6">
                <p className="font-semibold text-gray-900">
                    <span className="absolute inset-0" />
                    {data.eventOwner.firstName}

                </p>
                <p className="text-gray-600">Host</p>
              </div>
            </div>
            <div className="relative mt-8 flex items-center gap-x-4">
              <div className="text-sm leading-6">
              <Link to={`/events/${id}/addActivity`} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-green-400">Add Activity</Link>
              <ActivityList activities={data.activities} />
              </div>
            </div>
          </article>
      </div>

        
        <div className="d-flex justify-content-between align-items-center mt-3">
        <button onClick={() => submit(data)} className="btn btn-sm btn-danger mx-2" disabled={data.isDeleting}>
          <span>Delete</span>
        </button>
        </div>
        </div>
        </div>
      
      
)
              }
              </div>


//  <button className="btn btn-sm btn-primary mx-2" onClick={() => {
// const eventName = data.title;
// const eventLink = window.location.href;
// const recipient = "healthyboi@example.com";
// const subject = "Invitation to join my event";
// const body = `
//   <p>Hey Healthyboi,</p>
//   <p>You are hereby invited to join my event: <strong>${eventName}</strong>.</p>
//   <p>Are you up for the challenge?</p>
//   <p><a href="${eventLink}">Join here</a></p>
//   <p>Best regards,</p>
//   <p>Your Host</p>
// `;

// window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
// }}>Invite</button>
//               <button className="btn btn-sm btn-success mx-2">Sign up</button>
//       </div>
//       </div>
//     )}
//     {data?.loading && (
//       <div className="text-center">
//         <span className="spinner-border spinner-border-lg align-center"></span>
//       </div>
  )}