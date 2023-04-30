import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { eventsActions } from '_store';

export { List };

function List() {
    const events = useSelector(x => x.events.list);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(eventsActions.getReferenceAll());
    }, []);

    return (
        <div>
            <h1>Events</h1>
            
            {events?.value?.map(event =>
                <div key={event.id} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{event.title}</h5>
                        <button onClick={() => dispatch(eventsActions.delete(event.id))} className="btn btn-sm btn-danger" disabled={event.isDeleting}>
                            {event.isDeleting 
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : <span>Delete</span>
                            }
                        </button>
                    </div>
                </div>
            )}
            {events?.loading &&
                <div className="text-center">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            <Link to="add" className="btn btn-sm btn-success mb-2">Add event</Link>
        </div>
    );
}
