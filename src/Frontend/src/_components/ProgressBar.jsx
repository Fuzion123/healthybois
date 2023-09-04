import React, { useState, useEffect } from 'react';

function ProgressBar({ progress }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
   
    setWidth(progress);
  }, [progress]);

  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
            In Progress
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-teal-600">
            {width}%
          </span>
        </div>
      </div>
      <div className="flex h-2 overflow-hidden bg-teal-200 rounded">
        <div
          style={{ width: `${width}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;
