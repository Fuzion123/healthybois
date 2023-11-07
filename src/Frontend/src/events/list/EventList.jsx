import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import { eventapi } from "_api";
import { useQuery } from "react-query";
import { userService } from "_helpers";
import EventListDetails from "./EventListDetails";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import { animateScroll } from "react-scroll";

export default EventList;

function EventList() {
  const navigate = useNavigate();
  const [showCompleted, setShowCompleted] = useState(false);

  const { data, error, isLoading } = useQuery(
    `/user/events/${userService.currentUser.id}`,
    async () => {
      return await eventapi.getAll();
    }
  );

  if (isLoading) {
    return (
      <div className="text-center">
        <span className="spinner-border spinner-border-lg align-center"></span>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="">
        <div className="grid justify-items-center">
          <button
            onClick={() => navigate(`/events/add`)}
            className="btn-primary"
          >
            <AddIcon /> Create new event
          </button>
        </div>
      </div>
      <div>
        <div>
          {data.activeEvents.length > 0 && (
            <div className="py-4">
              <h1 className="text-2xl font-bold">Active events</h1>
              <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
                {data.activeEvents.map((event) => (
                  <EventListDetails key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
          {data.upcomingEvents.length > 0 && (
            <div className="py-4">
              <h1 className="text-2xl font-bold">Upcoming events</h1>
              <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
                {data.upcomingEvents.map((event) => (
                  <EventListDetails key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div id="hehehe" className="flex flex-col">
          {showCompleted === true && (
            <div>
              {data.completedEvents.length > 0 && (
                <div className="py-4">
                  <h1 className="text-2xl font-bold">Completed events</h1>
                  <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
                    {data.completedEvents.map((event) => (
                      <EventListDetails key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {data.completedEvents.length > 0 && showCompleted === false && (
            <div className="grid justify-items-center align-items">
              <button
                onClick={() => {
                  animateScroll.scrollMore(500, {
                    duration: 25,
                    smooth: true,
                  });
                  setShowCompleted(true);
                }}
              >
                Show completed events <KeyboardArrowDownIcon />
              </button>
            </div>
          )}

          {data.completedEvents.length > 0 && showCompleted === true && (
            <div className="grid justify-items-center">
              <button onClick={() => setShowCompleted(false)}>
                hide <KeyboardArrowUpIcon />
              </button>
            </div>
          )}
        </div>

        {data.completedEvents.length === 0 &&
          data.activeEvents.length === 0 &&
          data.upcomingEvents.length === 0 && (
            <div className="grid justify-items-center align-items">
              <h1 className="text-2xl font-bold">Wow, so empty!</h1>
            </div>
          )}
      </div>
    </div>
  );
}
