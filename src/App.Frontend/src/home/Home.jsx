import { useSelector } from "react-redux";
import React from "react";
import { eventapi } from "_api";
import { useQuery } from "react-query";
import EventListDetails from "events/list/EventListDetails";

export { Home };

function Home() {
  const auth = useSelector((x) => x.auth.value);

  // query

  const { data, error, isLoading } = useQuery(
    `/user/events/${auth.id}`,
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
            {data.activeEvents.map((event) => (
              <div key={event.id}>
                <EventListDetails event={event} />
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Event */}

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Your Upcoming Events</h2>
          <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
            {data.upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id}>
                <EventListDetails event={event} />
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
