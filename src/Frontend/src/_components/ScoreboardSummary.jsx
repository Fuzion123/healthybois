// App.js
import Chart from "chart.js/auto";
import React from 'react';
import { Line } from "react-chartjs-2";

console.log(Chart);

export default function ScoreboardSummary({event}) {

  console.log(event);

  const activities = event.activities.map(activity => activity.title); 



  const participants = event.participants.map(participant => {
    const id = participant.id;
    let cumulativeScore = 0; // Initialize the cumulative score for this participant

    const scores = event.activities.map(activity => {
      const participantResult = activity.results.find(result => result.participantId === id);

      if (participantResult) {
        cumulativeScore += participantResult.score; // Add the score to the cumulative score
        return cumulativeScore; // Use the cumulative score for this activity
      }

      return cumulativeScore; // Use the current cumulative score even if no result found
    });

    return {
      name: participant.firstName,
      scores: scores,
    };
  });


  console.log(participants);



  const MultiLineChart = ({ activities, participants }) => {
    // Create a dataset for each participant
    const datasets = participants.map((participant) => ({
      label: participant.name,
      data: participant.scores,
      fill: false, // Set to false for a line chart
      borderColor: getRandomColor(), // Helper function to generate random colors
    }));
  
    // Helper function to generate random colors
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  
    // Create the chart data
    const chartData = {
      labels: activities,
      datasets: datasets,
    };
  
    // Create the chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: false,
            text: 'Activities',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Score',
          },
          beginAtZero: true,
        },
      },
    };
  
    return (
      <div>
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Multi-line Chart</h1>
      <MultiLineChart activities={activities} participants={participants} />
    </div>
  );
}