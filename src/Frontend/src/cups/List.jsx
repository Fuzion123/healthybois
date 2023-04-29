import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { cupsActions } from '_store';

export { List };

function List() {
    const cups = useSelector(x => x.cups.list);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(cupsActions.getReferenceAll());
    }, []);

    return (
        <div>
            <h1>Cups</h1>
            <Link to="add" className="btn btn-sm btn-success mb-2">Add Cup</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Cup name</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {cups?.value?.map(cup =>
                        <tr key={cup.id}>
                            <td>{cup.title}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <button onClick={() => dispatch(cupsActions.delete(cup.id))} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={cup.isDeleting}>
                                    {cup.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {cups?.loading &&
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
