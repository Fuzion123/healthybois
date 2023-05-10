import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { eventsActions } from '_store';
import { useEffect } from 'react';
// import { userActions } from '_store';
import { confirmAlert } from 'react-confirm-alert';




export default  EventDetails;

function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const event = useSelector(z => z.events.item);
  // const users = useSelector(x => x.users.list);

  useEffect(() => {
    dispatch(eventsActions.get(id));
  }, []);

//   useEffect(() => {
//     dispatch(userActions.getAll());
// }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'Europe/Berlin'
    }).format(new Date(date));
  }

 // Delete event moved here

const submit = (event) => {

  confirmAlert({
    title: <span className="confirm-title">Confirm to delete</span>,
    message: <span className="confirm-message">Are you sure?</span>,
    buttons: [
      {
        label: 'Yes',
        className: 'confirm-button',
        onClick: () => dispatch(eventsActions.delete(event.id))
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
    {(event?.value) && (
      <div>
        <h1>{event.value.title}</h1>
        <div className="card">
          <div className="card-body">
            <img src='https://play-lh.googleusercontent.com/N6yBgv77P8b3T2gZu4ARO8kBjZ0nPMt1pKKip1ox4b-jw8lvqfC-pLcoBWVJwSsfnQ=s256-rw' alt='stock'></img>
            <section className="mt-3">
              <h4>Details:</h4>
              <p>Arranged by: </p>
              <p>Starts at: {formatDate(event.value.startsAt)}</p>
              <p>Ends at: {formatDate(event.value.endsAt)}</p>
            </section>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-body">
            <h4>Participants:</h4>
            <ul className="list-group">
              {event.value.participants.map((p, index) => (
                <li
                  key={p.userId}
                  className={`list-group-item ${index % 2 === 0 ? 'bg-light' : ''}`}
                >
                  <p>UserId: {p.userId}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
        <button onClick={() => submit(event)} className="btn btn-sm btn-danger mx-2" disabled={event.isDeleting}>
          {event.isDeleting ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            <span>Delete</span>
          )}
        </button>
        <button className="btn btn-sm btn-primary mx-2">Invite</button>
              <button className="btn btn-sm btn-success mx-2">Sign up</button>
      </div>
      </div>
    )}
    {event?.loading && (
      <div className="text-center">
        <span className="spinner-border spinner-border-lg align-center"></span>
      </div>
    )}
  </div>
);


}


<style scoped>
{`


        #react-confirm-alert {
         display: flex;
         justify-content: center;
         text-align: center !important; 
         margin: 5px;
        }

        .btn btn-sm btn-danger {
          z-index: 999;
        }

        .react-confirm-alert-button-group {
         display: flex;
         justify-content: space-evenly;
         margin: 8px;
        }

        .react-confirm-alert-body {
         text-align: center !important; 
         border-style: groove;
         border-color: rgb(43, 42, 41);
         border-radius: 15px;
         padding: 18px;
         width: 300px;
        }

        .confirm-title {
         font-weight: bold;
         color: #212529;
         display: flex;
         justify-content: center;
         margin: 10px;
        }

        .confirm-message  {
         color: #212529;
         display: flex;
         justify-content: center;
         text-align: center;
        }

        a {
          text-decoration: none;
          color: #212529;
        }

        @media only screen and (min-width: 800px) {
          .react-confirm-alert-body{
            width: 400px;
          }
        }
        
      `}

</style>