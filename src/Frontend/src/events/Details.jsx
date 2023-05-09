import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { eventsActions } from '_store';
import { useEffect } from 'react';

export default  EventDetails;

function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const event = useSelector(z => z.events.item);

  useEffect(() => {
    dispatch(eventsActions.get(id));
  }, []);


  return (
    <div>
      {(event?.value) &&
          <div>
            <p>Id: {event.value.id}</p>
            <p>Title: {event.value.title}</p>
            <p>Starts at: {event.value.startsAt}</p>
            <p>Ends at: {event.value.endsAt}</p>
            <p>Ends at: {event.value.endsAt}</p>
            <p>Participants:</p>
            <div>
            <ul>
              {event.value.participants.map(p =>
                <li key={p.userId}>
                  <p>UserId: {p.userId}</p>
                </li>
              )}
            </ul>
            </div>
          </div>
          
      }
      {event?.loading &&
          <div className="text-center">
              <span className="spinner-border spinner-border-lg align-center"></span>
          </div>
      }
    </div>
  );
}