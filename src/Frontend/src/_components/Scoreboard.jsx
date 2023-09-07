import { eventapi } from '_api';
import {useQuery } from 'react-query';

export default ScoreBoard;

function ScoreBoard({event}) {
    
    // query
    const {data, error, isLoading} = useQuery('scoreboard', () => {
        return eventapi.getScoreboardByEventId(event.id);
    },{
        onSuccess: (d) => {
            console.log(d)
        }
    }
    );

    if(error)
        return "No points found"

    return (
    <div>
        <h2 className="text-2xl font-bold">Scoreboard</h2>
        {
            !isLoading && 
            <div>
                {data.map((p, index) => (
                    <li
                      key={p.id}
                      className={`flex items-center justify-between list-group-item ${index % 2 === 0 ? 'bg' : ''}`}
                    >
                      
                      <div
                        key={index}
                        className="relative flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full overflow-hidden"
                        >
                        <img
                            src={p.profilePictureUrl}
                            alt={`Profile ${index + 1}`}
                            className="object-cover w-full h-full"
                        />
                        </div>
                        <div><h1 class="text-2xl font-bold">{p.points}</h1></div>
                    </li>
                  ))}
            </div>
        }
    </div>
    )
}