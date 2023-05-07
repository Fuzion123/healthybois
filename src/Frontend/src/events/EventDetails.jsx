import React from 'react';
import { useParams } from 'react-router-dom';

export { Detail };

function Detail() {
  const { id } = useParams();
  return (
    <div>
      <h2>Event Details for ID: {id}</h2>
      {/* add additional details about the event */}
    </div>
  );
}

