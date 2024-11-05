import { Scoreboardapi } from "_api_v2";
import { useQuery } from "react-query";
import { useState } from "react";
import { useEffect } from "react";
import TotalScoreChart from "./Charts/TotalScoreChart";
import { ScoreboardHelper } from "./ScoreboardHelper";
import Dropdown from "_components/Dropdown";

const defaultOption = "Total scores";

export default function ScoreBoardv2({ eventId }) {
  const [options, setOptions] = useState([...defaultOption]);
  const [currentOption, setCurrentOption] = useState(defaultOption);
  const [series, setSeries] = useState([
    {
      name: "Scores",
      data: [],
    },
  ]);

  const { refetch } = useQuery(
    `scoreboard/${eventId}`,
    async () => {
      var limitedToActivities = [];

      if (currentOption !== defaultOption) {
        limitedToActivities.push(currentOption);
      }

      return await Scoreboardapi.getByEventId(
        eventId,
        limitedToActivities.join()
      );
    },
    {
      onSuccess: (data) => {
        if (data.results.length === 0) {
          return;
        }

        const seriesData = data.results
          .map((result) => {
            return {
              x: ScoreboardHelper.MapXLabel(result),
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

        setOptions([defaultOption, ...data.activityNames]);
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [refetch, currentOption]);

  return (
    <div id="scoreboard-chart-container">
      <Dropdown
        currentOption={currentOption}
        setCurrentOption={setCurrentOption}
        options={options}
      ></Dropdown>
      <TotalScoreChart series={series} type="bar"></TotalScoreChart>
    </div>
  );
}
