import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { eventsActions } from '_store';
import { date } from '_helpers';
import  ScoreboardSummary  from '../Scoreboard/ScoreboardSummary';

export default List;

function List() {
    const events = useSelector(x => x.events.list);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleCardClick(event) {
      navigate(`/events/${event.id}`);
    }
  

    useEffect(() => {
        dispatch(eventsActions.getReferenceAll());
    }, []);

    

    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
            <h1 className="text-2xl font-bold justify-self-start">Events</h1>
            <Link to="add" className="flex justify-self-end rounded-md bg-green-400 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500">Add event</Link>
            </div>
            
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
            {events?.value?.map(event =>
              <div key={event.id} className="flex flex-col my-8 shadow-md rounded-lg hover:cursor-pointer">
                    <div className="" onClick={() => handleCardClick(event)}>
                        <img className="object-cover w-full h-52 md:h-72 rounded-t-lg" src={event.eventPictureUrl} alt='stock'></img>
                        <ScoreboardSummary eventId={event.id}/>                                                         
                       
                        <h5 className="text-1xl font-bold px-3 py-3">{event.title}</h5>
                        <p className="text-1xl px-3 pb-3">{event.description}</p>
                        <div className="flex flex-wrap justify-between px-3 pb-3 text-xs">
                            <span>Starts at: {date.formatDate(event.startsAt)}</span>
                            {event.eventIsActive === true &&
                            <span className='bg-green-600 font-semibold text-white py-1 px-2'>Active</span>
                            }
                        </div>
                    </div>

              </div>

            )}
            </div>
            {events?.loading &&
                <div className="text-center">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            
        </div>
    );
}
