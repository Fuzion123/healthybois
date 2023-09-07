import React from 'react';


function ParticipantBar({ profiles }) {
  return (
    <>
    <div className='my-2'><p></p></div>
    <h2 className="text-2xl font-bold dark:text-white">Participants</h2>
    <br></br>
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
