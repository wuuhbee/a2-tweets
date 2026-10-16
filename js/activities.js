function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	tweet_array = tweet_array.filter(function(tweet) {
		return tweet.source === 'completed_event';
	});

	const activity_counts = tweet_array.reduce((acc, tweet) => {
		const activity = tweet.activityType;
		acc[activity] = (acc[activity] || 0) + 1;
		return acc;
	}, {});

	const activityChartValues = Object.entries(activity_counts)
		.map(([activity, count]) => {
			return {
				activityType: activity,
				num: count
			}
		});
	console.log(activityChartValues);

	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": activityChartValues
		},
		"mark": "bar",
		"encoding": {
			"x": {
				"field": "activityType",
				"type": "nominal",
				"sort": {"field": "num","order": "descending"},
				"axis": {
					"title": "Activity Type",
					"grid": true
				},
			},
			"y": {
				"field": "num",
				"type": "quantitative",
				"axis": {
					"title": "Number of Tweets"
				},
			} 
	  	}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	const topActivities = Object.entries(activity_counts)
		.sort(([,a],[,b]) => b-a)
		.slice(0, 3)
		.map(([activity]) => activity);
	
	
	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const chartValues = tweet_array.filter(tweet => topActivities.includes(tweet.activityType))
									.map(tweet => {
										const dayOfWeek = weekdays[tweet.time.getDay()];
										return {
											weekday: dayOfWeek,
											activityType: tweet.activityType,
											distance: tweet.distance
										};
									});
	
	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": chartValues
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "weekday",
				"type": "ordinal",
				"sort": weekdays,
				"axis": {
					"title": "time (day)",
					"grid": true
				},
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"axis": {
					"title": "distance (miles)"
				},
			},
			"color": {
				"field": "activityType",
				"type": "nominal",
				"legend": {
					"title": "Activity Type"
				},
				"scale": {
					"domain": ["run", "walk", "bike"],
					"range": ["#e7ba52", "#aec7e8", "#9467bd"]
				}
			},
	  	}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	distance_vis_agg_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": chartValues
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "weekday",
				"type": "ordinal",
				"sort": weekdays,
				"axis": {
					"title": "time (day)",
					"grid": true
				},
			},
			"y": {
				"aggregate": "mean",
				"field": "distance",
				"type": "quantitative",
				"axis": {
					"title": "distance (miles)"
				},
			},
			"color": {
				"field": "activityType",
				"type": "nominal",
				"legend": {
					"title": "Activity Type"
				},
				"scale": {
					"domain": ["run", "walk", "bike"],
					"range": ["#e7ba52", "#aec7e8", "#9467bd"]
				}
			},
	  	}
	}
	const distanceVis = document.getElementById('distanceVis');
	const distanceVisAggregated = document.getElementById('distanceVisAggregated');
	const aggregateButton = document.getElementById('aggregate');
	distanceVisAggregated.hidden = true;
	vegaEmbed('#distanceVisAggregated', distance_vis_agg_spec, {actions:false});

	aggregateButton.addEventListener('click', function() {
		const showMeans = distanceVisAggregated.hidden;
		distanceVis.hidden = showMeans;
		distanceVisAggregated.hidden = !showMeans;
		aggregateButton.textContent = showMeans ? 'Show all activities' : 'Show means';
	});

	// Updated fields
	document.getElementById('numberActivities').innerHTML = '<strong>16</strong>';
	document.getElementById('firstMost').innerHTML = '<strong>run</strong>';
	document.getElementById('secondMost').innerHTML = '<strong>walk</strong>';
	document.getElementById('thirdMost').innerHTML = '<strong>bike</strong>';
	document.getElementById('longestActivityType').innerHTML = '<strong>bike</strong>';
	document.getElementById('shortestActivityType').innerHTML = '<strong>walk</strong>';
	document.getElementById('weekdayOrWeekendLonger').innerHTML = '<strong>weekends</strong>';


}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});