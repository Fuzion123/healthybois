import { eventapi } from "_api";
import { useQuery } from "react-query";

export default ScoreBoard;

function ScoreBoard({ event }) {
  // query
  const { data, error, isLoading } = useQuery(
    `scoreboard/${event.id}`,
    async () => {
      return await eventapi.getScoreboardByEventId(event.id);
    }
  );

  if (error) return "No points found";

  if (isLoading) return "loading...";

  const sortedData = [...data].sort((a, b) => b.points - a.points);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Scoreboard</h2>
      {!isLoading && (
        <div>
          {sortedData.map((p, index) => (
            <li
              key={p.id}
              className={`pt-1.5 flex items-center justify-between list-group-item px-3 rounded ${
                index % 2 === 0 ? "bg" : ""
              } ${
                index === 0
                  ? "bg-yellow-400 text-white"
                  : index === 1
                  ? "bg-zinc-400 text-white"
                  : index === 2
                  ? "bg-amber-700 text-white"
                  : "bg-slate-100"
              }`}
            >
              <div
                key={index}
                className="mb-2 relative flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full overflow-hidden"
              >
                <img
                  src={p.profilePictureUrl}
                  alt={`Profile ${index + 1}`}
                  className=" object-cover w-full h-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{p.points}</h1>
              </div>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}
