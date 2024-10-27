import React, { useState, useEffect } from "react";

export { RegisterProgress };

function RegisterProgress({ progress, stepsCount, currentStepCount }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(progress);
  }, [progress]);

  return (
    <div className="relative pt-1">
      <div className="flex justify-center">
        <div className="text-right ">
          <span className="text-xs font-semibold inline-block text-teal-600">
            {currentStepCount}/{stepsCount}
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
