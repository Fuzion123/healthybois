import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { history } from "_helpers";

export default function ActivityList(props) {
  const { id } = useParams();
  const [containerSize, setContainerSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setContainerSize(Math.min(window.innerWidth, window.innerHeight));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!props || !props.activities || props.activities.length === 0) {
    return <div>No activities</div>;
  }

  function getRandomGradient() {
    const color1 = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const color2 = "#" + Math.floor(Math.random() * 16777215).toString(16);
  
    return `linear-gradient(45deg, ${color1}, ${color2})`;
  }
  
  function calculateBubblePosition(index, totalBubbles, containerSize) {
    const angle = (index / totalBubbles) * 2 * Math.PI;
    const radiusPercentage = 4;
    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    const radius = (minDimension / 2) * (radiusPercentage / 100);

    let gapSize;
    if (containerSize < 390) {
      // mobile
      gapSize = 9;
    } else {
      // desktop
      gapSize = 8;
    }

  const adjustedRadius = radius + gapSize;

  
  const x = Math.cos(angle) * adjustedRadius;
  const y = Math.sin(angle) * adjustedRadius;

  return { x, y };
}

  function goTo(p) {
    history.navigate(`/events/${id}/${p.id}`);
  }

  return (
    <div><h3 className="text-2xl font-bold mb-2">Activities</h3>
    <div className="relative mt-72">
      {props.activities.map((p, index) => {
        const { x, y } = calculateBubblePosition(
          index,
          props.activities.length,
          containerSize
        );

        const isMobile = containerSize < 390;

        const baseBubbleSize = isMobile ? 80 : 120;
        const bubbleSize = baseBubbleSize;
        const fontSize = isMobile ? "8px" : "12px";

        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              top: `calc(50% + ${y}vh)`,
              left: `calc(50% + ${x}vw)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              onClick={() => goTo(p)}
              className="bubble inline-flex flex-col items-center justify-center p-4 text-sm font-medium border cursor-pointer hover:bg-slate-100 rounded-full"
              style={{
                background: getRandomGradient(),
                boxShadow:
                  "0 4px 6px rgba(0, 0, 0, 0.1), 0 6px 12px rgba(0, 0, 0, 0.1)",
                width: `${bubbleSize}px`,
                height: `${bubbleSize}px`,
          
              }}
            >
              <div
                className="font-bold text-white	drop-shadow-lg"
                style={{
                  fontSize: fontSize,
                  textAlign: "center", 
                }}
              >
                # {index + 1}
              </div>
              <div
                className="font-bold text-white	"
                style={{
                  fontSize: fontSize,
                  textAlign: "center", 
                }}
              >
                {p.title}
              </div>
              {p.completed && (
                <div className="button self-center justify-center m-2">
                  <svg
                    className="w-3 h-3  text-white dark:text-green-400 flex-shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
        );
      })}
<button
  onClick={() => history.navigate(`/events/${id}/addActivity`)}
  className={`add absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-teal-400 hover:bg-teal-300 text-white font-bold ${
    containerSize > 390 ? 'py-1 px-2 text-xs' : 'py-2 px-4'
  } border-b-4 border-teal-700 hover:border-teal-500 rounded`}
>
  Add Activity
</button>
    </div>
    </div>
  );
}

