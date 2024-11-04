import { Scoreboardapi } from "_api_v2";
import { useQuery } from "react-query";
import Chart from "react-apexcharts";
import { useState } from "react";
import { useEffect } from "react";

export default function ScoreBoardv2({ eventId }) {
  const [series, setSeries] = useState([
    {
      name: "Scores",
      data: [],
    },
  ]);

  const { refetch } = useQuery(
    `scoreboard/${eventId}`,
    async () => {
      return await Scoreboardapi.getByEventId(eventId);
    },
    {
      onSuccess: (data) => {
        if (data.results.length === 0) {
          return;
        }

        const seriesData = data.results
          .map((result) => {
            return {
              x: MapXLabel(result),
              y: result.totalScoreSum,
            };
          })
          .sort((a, b) => a.y - b.y)
          .reverse();

        setSeries([
          {
            name: "Scores",
            color: "#FFD700",
            data: seriesData,
          },
        ]);
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const options = {
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    noData: {
      text: "Loading...",
    },
    dataLabels: {
      enabled: true,
      textAnchor: "end",
      style: {
        colors: ["#333"],
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
  };

  function MapXLabel(result) {
    var firstName = result.participant.firstName;
    var placement = result.participant.eventPlacement;

    var icon = "";

    if (placement === 1) {
      icon = "🥇";
    } else if (placement === 2) {
      icon = "🥈";
    } else if (placement === 3) {
      icon = "🥉";
    }

    return `${firstName} ${icon}`;
  }

  return (
    <div id="scoreboard-chart-container">
      <Chart options={options} series={series} type="bar"></Chart>
    </div>
  );
}
