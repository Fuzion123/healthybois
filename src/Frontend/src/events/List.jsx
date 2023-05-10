import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { eventsActions } from '_store';

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

    // const submit = (event) => {

    //     confirmAlert({
    //       title: <span className="confirm-title">Confirm to delete</span>,
    //       message: <span className="confirm-message">Are you sure?</span>,
    //       buttons: [
    //         {
    //           label: 'Yes',
    //           className: 'confirm-button',
    //           onClick: () => dispatch(eventsActions.delete(event.id))
    //         },
    //         {
    //           label: 'No',
    //           className: 'confirm-button',
    //           //onClick: () => alert('Click No')
    //         }
    //       ],
    //       containerProps: { 
    //         style: {
    //           zIndex: 9999, 
    //           position: 'absolute', 
    //           top: '20px', 
    //           left: '50%',
    //           transform: 'translateX(-50%)' // center the dialog horizontally
    //         }
    //       }
    //     });
    //   }
    
    return (
        <div>
            <h1>Events</h1>
            
            {events?.value?.map(event =>
              <div key={event.id} className="card mb-3">
                    <div className="card-body" onClick={() => handleCardClick(event)}>
                        <h5 className="card-title">{event.title}</h5>
                        {/* <button onClick={() => submit(event)} className="btn btn-sm btn-danger" disabled={event.isDeleting}>
                            {event.isDeleting 
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : <span>Delete</span>
                            }
                        </button> */}
                    </div>
                    </div>
                   
            )}
            {events?.loading &&
                <div className="text-center">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            <Link to="add" className="btn btn-sm btn-success mb-2">Add event</Link>

      
 
            <style>{`
        #react-confirm-alert {
         display: flex;
         justify-content: center;
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
        
      `}</style>
        </div>
    );
}
