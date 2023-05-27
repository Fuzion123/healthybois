import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default ActivityList;

function ActivityList(props) {

  const { activityId } = useParams();
  const { id } = useParams();

    if(!props || !props.activities || props.activities.length === 0){
        return (<div>No activities</div>)
    }


    return (
        <div>
            <h1>Activities</h1>
            <Link to={`/events/${id}/${activityId}`} >
              <ul  className="list-group">
                  {props.activities.map((p, index) => (
                    <li
                      key={p.id}
                      className={`list-group-item ${index % 2 === 0 ? 'bg-light' : ''}`}
                    >
                      <p>{p.title}</p>
                    </li>
                  ))}
                </ul>
            </Link>
        </div>
    );
}
