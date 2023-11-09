import React from "react";
import { useParams } from "react-router-dom";
import { history } from "_helpers";

export default ActivityList;

function getRandomGradient() {
  const color1 = "#" + Math.floor(Math.random()*16777215).toString(16);
  const color2 = "#" + Math.floor(Math.random()*16777215).toString(16);

  return `linear-gradient(45deg, ${color1}, ${color2})`;
}

function getActivityPosition(index, totalActivities) {
  const angle = ((index / totalActivities) * 2 - 0.5) * Math.PI;

  const x = Math.cos(angle) * 150; 
  const y = Math.sin(angle) * 150;

  return { transform: `translate(${x}px, ${y}px)` };
}

function ActivityList(props) {
  const { id } = useParams();

  if (!props || !props.activities || props.activities.length === 0) {
    return <div>No activities</div>;
  }

  function goTo(p) {
    history.navigate(`/events/${id}/${p.id}`);
  }

  return (
    <div className="flex flex-wrap">
      {props.activities.map((p, index) => (
        <div key={p.id} className="m-4 relative">
          <section className="stage">
            <figure className="ball" style={{ background: getRandomGradient() }}>
              <span className="shadow"></span>
            </figure>
          </section>

          <div
            onClick={() => goTo(p)}
            className="bubble relative inline-flex items-center p-4 text-sm font-medium border cursor-pointer hover:bg-slate-100 rounded-full"
            style={{
              background: getRandomGradient(),
              minWidth: "10rem",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 6px 12px rgba(0, 0, 0, 0.1)"
            }}
          >
            <div className="ml-2 font-bold mr-4"># {index + 1}</div>
            <div className="font-bold">{p.title}</div>
            {p.completed && (
              <div className="self-center justify-center m-2">
                <svg
                  className="w-3 h-3 m-2 text-green-500 dark:text-green-400 flex-shrink-0"
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
      ))}
    </div>
  );
}
