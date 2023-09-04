import React from 'react';


function ParticipantBar({ profiles }) {
  return (
    <>
    <div className='my-2'><p>Participants</p></div>
    <div className="flex items-center space-x-4">
      {profiles.map((profile, index) => (
        <div
          key={index}
          className="relative flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full overflow-hidden"
        >
          <img
            src={profile.profilePictureUrl}
            alt={`Profile ${index + 1}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
    </>
  );
}

export default ParticipantBar;
