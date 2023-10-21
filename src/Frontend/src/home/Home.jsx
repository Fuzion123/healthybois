import { useSelector } from "react-redux";
import React from "react";
import { useNavigate } from "react-router-dom";
import { eventapi } from "_api";
import { useQuery } from "react-query";
import { userService } from "_helpers";
import { date } from "_helpers";
// import { Messages } from '_components';

export { Home };

function Home() {
  const navigate = useNavigate();
  const user = userService.currentUser;

  const auth = useSelector((x) => x.auth.value);

  // query


  const { data, error, isLoading } = useQuery(
    `/user/events/${user.id}`,
    async () => {
      return await eventapi.getAll();
    }
  );

  if (isLoading) {
    return (
      <div className="text-center">
        <p className="spinner-border spinner-border-lg align-center"></p>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  var today = new Date().toISOString();

  const currentEvent = data.filter((event) => {
    return event.startsAt <= today && today <= event.endsAt ;
  });

  const nextEvents = data.filter((event) => {
    return event.startsAt >= today ;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center py-4 px-8">
        <h1 className="text-2xl font-bold">Welcome {auth?.firstName}!</h1>
      </header>

      {/* Sections */}

      <div className="container mx-auto px-4 py-8">

        {/* Current Event */}

        <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Current Event</h2>
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
            {currentEvent
            .map((event) => (              
              <div
                key={event.id}
                className="flex flex-col my-8 shadow-md rounded-lg"
              >
                <div
                  className=""
                  onClick={() => navigate(`/events/${event.id}`)}
                >                  
                  <img
                    className="object-cover w-full h-52 md:h-72 rounded-t-lg"
                    src={event.eventPictureUrl}
                    alt="stock"
                  ></img>
                  <h5 className="text-1xl font-bold px-3 py-3">
                    {event.title}
                  </h5>
                  <div className="text-1xl px-3 pb-3">{event.description}</div>
                  <div className="flex flex-wrap justify-between items-center px-3 pb-3 text-xs">
                    <span>Starts at: {date.formatDate(event.startsAt)}</span>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Event */}

        <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Your Upcoming Events</h2>  
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
            {nextEvents
            .slice(0, 3)
            .map((event) => ( 
              <div
                key={event.id}
                className="flex flex-col my-8 shadow-md rounded-lg"
              >
                <div
                  className=""
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <img
                    className="object-cover w-full h-52 md:h-72 rounded-t-lg"
                    src={event.eventPictureUrl}
                    alt="stock"
                  ></img>
                  <h5 className="text-1xl font-bold px-3 py-3">
                    {event.title}
                  </h5>
                  <div className="text-1xl px-3 pb-3">{event.description}</div>
                  <div className="flex flex-wrap justify-between items-center px-3 pb-3 text-xs">
                    <span>Starts at: {date.formatDate(event.startsAt)}</span>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

         {/* Player in focus */}

        <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Player in focus</h2>  
            
        </section>


      </div>
    </div>
  );
}
