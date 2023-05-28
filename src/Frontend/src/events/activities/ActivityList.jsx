import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default ActivityList;

function ActivityList(props) {

  const { id } = useParams();

    if(!props || !props.activities || props.activities.length === 0){
        return (<div>No activities</div>)
    }


    return (
        <div>
            <h1>Activities</h1>
              <ul  className="list-group">
                  {props.activities.map((p, index) => (
                    <li
                      key={p.id}
                      className={`list-group-item ${index % 2 === 0 ? 'bg-light' : ''}`}
                    >
                      <Link to={`/events/${id}/${p.id}`} >{p.title}</Link>
                    </li>
                  ))}
                </ul>
        </div>
    );
}
