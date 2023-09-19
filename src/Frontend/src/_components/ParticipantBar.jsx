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
      setParticipantPoints(d.map(() => null)); // Initialize with null values
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
      const draggedParticipant = data[draggedParticipantIndex];
      newPoints[pointIndex] = draggedParticipant; // Place the dragged participant in the new position

      // Clear the old position by setting it to null
      if (participantPoints[pointIndex] !== null) {
        const oldPositionIndex = data.findIndex(p => p.id === participantPoints[pointIndex].id);
        if (oldPositionIndex !== -1) {
          newPoints[oldPositionIndex] = null;
        }
      }

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
            className={`relative flex-shrink-0 w-16 h-16 ${participantPoints[index] ? "opacity-0" : ""} rounded-full overflow-hidden bg-gray-200`}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
          >
            {participantPoints[index] === null ? (
              <img
                src={p.profilePictureUrl}
                alt={p.firstName}
                className="object-cover w-full h-full rounded-full" // Apply rounded-full class
              />
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-4 mt-4">
        {participantPoints.map((participant, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-full ${participant ? "" : "bg-gray-200"} flex items-center justify-center`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            {participant ? (
              <img
                src={participant.profilePictureUrl}
                alt={participant.firstName}
                className="object-cover w-full h-full rounded-full" // Apply rounded-full class
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
