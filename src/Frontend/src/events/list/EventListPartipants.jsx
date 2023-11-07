import { useState, useEffect } from "react";
import EventListPartipant from "./EventListPartipant";

const defaultLimitCount = 2;

export default function EventListPartipants({ participants }) {
  const [showMore, setShowMore] = useState(false);
  const [showCount, setShowCount] = useState(defaultLimitCount);

  useEffect(() => {
    if (showMore === false) {
      setShowCount(defaultLimitCount);
    } else if (participants) {
      setShowCount(participants.length);
    }
  }, [showMore]);

  if (!participants || participants.length === 0) return undefined;

  function handleShowMore() {
    if (participants.length > defaultLimitCount) {
      setShowMore(!showMore);
    }
  }

  return (
    <div className="py-2">
      {participants.length > 0 && (
        <div
          onClick={handleShowMore}
          className={`flex px-3 ${
            participants.length > defaultLimitCount ? "" : "cursor-default"
          }`}
        >
          <div className="flex flex-wrap">
            {participants.slice(0, showCount).map((participant) => {
              return (
                <EventListPartipant
                  key={participant.id}
                  participant={participant}
                />
              );
            })}
            {participants.length > defaultLimitCount && showMore === false && (
              <div className="grid content-center mt-2 ml-2">
                <p>+ {participants.length - defaultLimitCount}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
