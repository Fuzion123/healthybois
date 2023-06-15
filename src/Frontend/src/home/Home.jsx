import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventapi } from '../_api'
import { participantsapi } from '_api';
import {useQuery } from 'react-query';
import { Messages } from '_components';
import { eventsActions } from '_store';

export { Home };

function Home(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleCardClick(event) {
    navigate(`/events/${event.id}`);
  }

  useEffect(() => {
      dispatch(eventsActions.getReferenceAll());
  }, []);

  const auth = useSelector(x => x.auth.value);

  // query

  const {data, error, isLoading} = useQuery('getAllEvents', () => {
    return eventapi.getAll();
  });

  

  if (error) return <div>Request Failed</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center py-4 px-8">
        <h1 className="text-2xl font-bold">Welcome {auth?.firstName}</h1>
      </header>

      {/* Sections */}

      <div className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-8">
              <h3 className="text-md font-bold mb-2">Get ready to compete</h3>
              <p className="text-gray-600">Don't miss out on our upcoming events! Join an event for an unforgettable experience filled with excitement, inspiration, and community. Sign up and claim your spot among the champions!</p>
            </div>
            <div className="bg-green-50 p-8 shadow-md rounded-lg">
              <h3 className="text-md font-bold mb-2">Next 3 events</h3>
              <p className="text-gray-600">
                {data
                  .sort((a, b) => a.startsAt - b.startsAt)
                  .slice(0, 3)
                  .map((p, i) => (
                    <div key={i} onClick={() => handleCardClick(p)}>
                    <img className="object-cover w-50 h-50 md:h-20 rounded-t-lg" src={p.eventPictureUrl} alt="stock" />
                    <p className='font-semibold'>{p.title}</p>
                    <img alt="profile" className="h-10 w-10" src={p.eventOwner.profilePictureUrl}></img>
                  </div>
          ))}</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Highlighted Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-8">
              <h3 className="text-md font-bold mb-2">Check this guy out</h3>
              <p className="text-gray-600">With exceptional skills and unmatched dedication, is a force to be reckoned with on in the tourney. Don't miss the opportunity to witness their extraordinary performances or beat them in the upcoming events</p>
            </div>
            <div className="bg-yellow-50 p-8 shadow-md rounded-lg">
              <h3 className="text-md font-bold mb-2">Player in focus</h3>
              <p className="text-gray-600"></p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Latest post</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-8">
              <h3 className="text-md font-bold mb-2">Connect with others</h3>
              <p className="text-gray-600">Join the vibrant message board community and connect with fellow competitors. Share strategies, exchange tips, and engage in meaningful discussions to enhance your competitive journey.</p>
            </div>
            <div className="bg-cyan-50 p-2 shadow-md rounded-lg">
              <p className="text-gray-600"><Messages connection={props.connection} messages = { props.messages }></Messages></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
