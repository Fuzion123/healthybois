import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


export { Detail };
function Detail() {
  const { id } = useParams();
  const event = useSelector(state => state.events.list.value.find(e => e.id === id));

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <h1>{event.id}</h1>
      <p>{event.description}</p>
    </div>
  );
}

