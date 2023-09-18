import { participantsapi } from "_api";
import { useQuery } from "react-query";
import { useState } from "react";

function ParticipantBar({ eventId }) {
  const [participantPoints, setParticipantPoints] = useState([]);

  const { data, error, isLoading } = useQuery(`/participantsapi.getById/${eventId}`, async () => {
    return await participantsapi.getByEventId(eventId);
  }, {
    onSuccess: (d) => {
      console.log('data: ' + JSON.stringify(d));
      setParticipantPoints(new Array(d.length).fill(null));
    }
  });

  if (error) 
    return <div>Request Failed</div>;

  if (isLoading) 
    return <div>Loading...</div>;

  const handleDragStart = (e, participantIndex) => {
    e.dataTransfer.setData("participantIndex", participantIndex);
  };

  const handleDragOver = (e, pointIndex) => {
    e.preventDefault();
  };

  const handleDrop = (e, pointIndex) => {
    e.preventDefault();
    const draggedParticipantIndex = e.dataTransfer.getData("participantIndex");

    if (draggedParticipantIndex !== "") {
      const newPoints = [...participantPoints];
      newPoints[pointIndex] = data[draggedParticipantIndex];
      newPoints[draggedParticipantIndex] = null;

      setParticipantPoints(newPoints);
    }
  };

  return (
    <>
      <div className="my-2">
        <p></p>
      </div>
      <h2 className="text-2xl font-bold dark:text-white">Participants</h2>
      <br />
      <div className="flex items-center space-x-4">
        {data.map((p, index) => (
          <div
            key={p.id}
            className={`relative flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full overflow-hidden ${participantPoints[index] ? "opacity-0" : ""}`}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
          >
            <img
              src={p.profilePictureUrl}
              alt={p.firstName}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-4 mt-4">
        {participantPoints.map((participant, index) => (
          <div
            key={index}
            className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center"
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            {participant ? (
              <img
                src={participant.profilePictureUrl}
                alt={participant.firstName}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="text-gray-500">Drop Here</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default ParticipantBar;
