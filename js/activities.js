function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	updateActivitySpans(tweet_array);

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

function updateActivitySpans(tweet_array) {
	most_common_activities = tweet_array.reduce((acc, tweet) => {
		const activity = tweet.activityType;
		acc[activity] = (acc[activity] || 0) + 1;
		return acc;
	}, {});
	
	document.getElementById('numberActivities').innerText = Object.keys(most_common_activities).length;


	const sorted_activities = Object.fromEntries(Object.entries(most_common_activities).sort(([,a],[,b]) => b-a));

	document.getElementById('firstMost').innerText = Object.keys(sorted_activities)[0];
	document.getElementById('secondMost').innerText = Object.keys(sorted_activities)[1];
	document.getElementById('thirdMost').innerText = Object.keys(sorted_activities)[2];
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});