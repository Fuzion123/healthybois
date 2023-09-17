import { eventapi } from "_api_v2";
import { useQuery } from 'react-query';
// Initialization for ES Users
import {
  Chart,
  initTE,
} from "tw-elements";

initTE({ Chart });

export default ScoreboardSummary;

function ScoreboardSummary({ event }) {
  // query
  const { data, error, isLoading } = useQuery(
    `scoreboard/${event.id}`,
    async () => {
      return await eventapi.getScoreboardByEventId(event.id);
    },
    {
      onSuccess: (d) => {
        console.log(d);
        
      },
    }
  );

  if (error) return "No points found";

  if (isLoading) return 'loading...';


  const users = [...data].sort((a, b) => b.points - a.points);
  console.log(users);

  const dataset = users.forEach((user) => {
    console.log(user.firstName);
    console.log(user.points);
    return (            
      {
        label: `${user.firstName}`,
        data: [user.points,],
      }
    );
  });

  const dataLine = {
    type: 'line',
    data: {
      labels: ['Monday',],
      datasets: [ 
        dataset
      ],
    },
  };

  new Chart(document.getElementById('line-chart'), dataLine);

  return (
    
    <div className="mx-auto w-3/5 overflow-hidden">
      <canvas id="line-chart"></canvas>
    </div>
  );
}
