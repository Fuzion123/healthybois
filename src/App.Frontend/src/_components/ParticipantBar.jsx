import { participantsapi } from "_api";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";

function ParticipantBar({ eventId }) {
  const [participantPositions, setParticipantPositions] = useState([]);
  const [draggedParticipant, setDraggedParticipant] = useState(null);

  const { data, error, isLoading } = useQuery(
    `/participantsapi.getById/${eventId}`,
    async () => {
      return await participantsapi.getByEventId(eventId);
    },
    {
      onSuccess: (d) => {
        console.log("data: " + JSON.stringify(d));
        // Initialize the participant positions array
        const initialPositions = new Array(d.length).fill(null);
        setParticipantPositions(initialPositions);
      },
    }
  );

  useEffect(() => {
    // When the data changes, update the participant positions based on their IDs
    if (data) {
      setParticipantPositions((prevPositions) => {
        const positions = new Array(data.length).fill(null);
        data.forEach((participant, index) => {
          const existingIndex = prevPositions.findIndex(
            (pos) => pos && pos.id === participant.id
          );
          if (existingIndex !== -1) {
            positions[index] = prevPositions[existingIndex];
          }
        });
        return positions;
      });
    }
  }, [data]);

  if (error) return <div>Request Failed</div>;

  if (isLoading || !data) return <div>Loading...</div>;

  const handleDragStart = (e, participantIndex) => {
    setDraggedParticipant(data[participantIndex]);
  };

  const handleDragOver = (e, pointIndex) => {
    if (e) {
      e.preventDefault();
    }
  };

  // const handleDragEnd = (e, index) => {
  //   e.preventDefault();
  //   handleDrop(e, index);
  // };

  const handleDrop = (e, pointIndex) => {
    e.preventDefault();
    if (draggedParticipant !== null) {
      setParticipantPositions((prevPositions) => {
        const newPositions = [...prevPositions];

        // Find the index of the dragged participant in the old position
        const oldPositionIndex = prevPositions.findIndex(
          (pos) => pos === draggedParticipant
        );

        // Clear the old position, no matter where it was dropped
        if (oldPositionIndex !== -1) {
          newPositions[oldPositionIndex] = null;
        }

        // Place the dragged participant in the new position
        newPositions[pointIndex] = draggedParticipant;
        setDraggedParticipant(null);

        return newPositions;
      });
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
            className={`relative flex-shrink-0 w-16 h-16 ${
              participantPositions[index] ? "opacity-0" : ""
            } rounded-full overflow-hidden bg-gray-200`}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
          >
            {participantPositions[index] === null ? (
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
        {participantPositions.map((participant, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-full ${
              participant ? "" : "bg-gray-200"
            } flex items-center justify-center`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)} // Pass the event object
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
