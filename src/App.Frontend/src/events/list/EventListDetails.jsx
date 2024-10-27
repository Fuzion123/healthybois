import EventStatus from "./EventStatus";
import { useNavigate } from "react-router-dom";
import { date } from "_helpers";
import EventListPartipants from "./EventListPartipants";

export default function EventListDetails({ event }) {
  const navigate = useNavigate();

  function goToEvent() {
    navigate(`/events/${event.id}`);
  }

  return (
    <div className="flex flex-col my-2 shadow-md rounded-lg hover:cursor-pointer">
      <div>
        <img
          className="object-cover w-full h-52 md:h-72 rounded-t-lg"
          src={event.eventPictureUrl}
          alt="stock"
          onClick={goToEvent}
        ></img>
        <h5 className="text-1xl font-bold px-3 pt-3 pb-2" onClick={goToEvent}>
          {event.title}
        </h5>
        {event.description && event.description.length > 0 && (
          <p onClick={goToEvent} className="text-1xl px-3 pb-3">
            {event.description}
          </p>
        )}
        <EventListPartipants participants={event.participants} />
        <div
          onClick={goToEvent}
          className="flex flex-wrap justify-between items-center px-3 pb-3 pt-2 text-xs"
        >
          <span>{date.formatDate(event.startsAt)}</span>
          <EventStatus event={event} />
        </div>
      </div>
    </div>
  );
}
