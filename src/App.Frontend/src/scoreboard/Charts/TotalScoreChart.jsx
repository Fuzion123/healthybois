import Chart from "react-apexcharts";

export default function TotalScoreChart({ series }) {
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

  return (
    <div id="scoreboard-chart-container">
      <Chart options={options} series={series} type="bar"></Chart>
    </div>
  );
}
