import { useParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import {useQuery, useMutation } from 'react-query';
import { eventapi } from '_api';
import { history, date } from '_helpers';
import  Back_button  from '../_components/Back_button';


export default  EventDetails;

function EventDetails() {
  const { id } = useParams();

	// query
	const {data, error, isLoading} = useQuery('getById', () => {
    return eventapi.getById(id);
  });

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
    {<Back_button />}
    {(data) && (
      <div>
        <h1>{data.title}</h1>
        <div className="card">
          <div className="card-body">
            <img src='https://play-lh.googleusercontent.com/N6yBgv77P8b3T2gZu4ARO8kBjZ0nPMt1pKKip1ox4b-jw8lvqfC-pLcoBWVJwSsfnQ=s256-rw' alt='stock'></img>
            <section className="mt-3">
              <h4>Details:</h4>
              <p>Arranged by: </p>
              <p>Starts at: {date.formatDate(data.startsAt)}</p>
              <p>Ends at: {date.formatDate(data.endsAt)}</p>
            </section>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-body">
            <h4>Participants:</h4>
            <ul className="list-group">
              {data.participants.map((p, index) => (
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
        <button onClick={() => submit(data)} className="btn btn-sm btn-danger mx-2" disabled={data.isDeleting}>
          <span>Delete</span>
        </button>
        <button className="btn btn-sm btn-primary mx-2" onClick={() => {
const eventName = data.title;
const eventLink = window.location.href;
const recipient = "healthyboi@example.com";
const subject = "Invitation to join my event";
const body = `
  <p>Hey Healthyboi,</p>
  <p>You are hereby invited to join my event: <strong>${eventName}</strong>.</p>
  <p>Are you up for the challenge?</p>
  <p><a href="${eventLink}">Join here</a></p>
  <p>Best regards,</p>
  <p>Your Host</p>
`;

window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}}>Invite</button>
              <button className="btn btn-sm btn-success mx-2">Sign up</button>
      </div>
      </div>
    )}
    {data?.loading && (
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