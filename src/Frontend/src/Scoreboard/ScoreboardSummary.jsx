import { useQuery, useMutation } from 'react-query';
import { Scoreboardapi } from '_api';
import React, { Component } from 'react';
import ApexCharts from 'apexcharts'

export default ScoreboardSummary;

function ScoreboardSummary(props) {

	let chart;
	let chartConfigured = false;
	const eventId = (props.eventId);
	console.log(eventId)
	// query
	const { data, error, isLoading } = useQuery(`scoreboardsummary-${eventId}`, () => {
		return Scoreboardapi.getByEventId(eventId);
	}, {
		onSuccess: (d) => {


			console.log(d);

			let yData = d.results.map(r => {
				return r.totalScoreSum
			});

			let xData = d.results.map(x => {
				console.log(x.participant.firstName); 
				return x.participant.firstName
			})
			console.log(xData);

			var options = {
				chart: {
					type: 'bar'
				},
				series: [{
					name: 'Scoreboard',
					data: yData
				}],
				xaxis: {
					categories: xData
				}
			}

			chart = new ApexCharts(document.querySelector(`#chart-${eventId}`), options); 
			chart.render();
		}
		
	});

	function renderChart(){
		
	}

	if (error) return <div>Request Failed</div>; 

	if (isLoading) return <div>Loading...</div>;


	return (
		<div>

			{data.eventId}
			{data.results.map((result, index) => (

				<li
					key={index}
					className={`list-group-item ${index % 2 === 0 ? 'bg-light' : ''}`}
				>
					<p>Name: {result.participant.firstName}</p>
					<p>Total Score: {result.totalScoreSum}</p>
					<img className="h-10 w-10" src={result.participant.profilePictureUrl}></img>
					<div id={`chart-${eventId}`}></div>
					{(chartConfigured) &&
						<div>ready</div>
					}
				</li>

			))}

		</div>
	);

}


