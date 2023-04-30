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
            <h1>events</h1>
            <Link to="add" className="btn btn-sm btn-success mb-2">Add event</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>event name</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {events?.value?.map(event =>
                        <tr key={event.id}>
                            <td>{event.title}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <button onClick={() => dispatch(eventsActions.delete(event.id))} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={event.isDeleting}>
                                    {event.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {events?.loading &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>

                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}
