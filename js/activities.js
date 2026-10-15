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
	// updating most common activities and number of activities
	most_common_activities = tweet_array.reduce((acc, tweet) => {
		const activity = tweet.activityType;
		acc[activity] = (acc[activity] || 0) + 1;
		return acc;
	}, {});
	
	document.getElementById('numberActivities').innerHTML = '<strong>' + Object.keys(most_common_activities).length + '</strong>';

	const sorted_activities = Object.fromEntries(Object.entries(most_common_activities).sort(([,a],[,b]) => b-a));
	document.getElementById('firstMost').innerHTML = '<strong>' + Object.keys(sorted_activities)[0] + '</strong>';
	document.getElementById('secondMost').innerHTML = '<strong>' + Object.keys(sorted_activities)[1] + '</strong>';
	document.getElementById('thirdMost').innerHTML = '<strong>' + Object.keys(sorted_activities)[2] + '</strong>';

	//updating the longest and shortest of the three activities
	first_most_tweets = tweet_array.filter(tweet => {
		return tweet.activityType === Object.keys(sorted_activities)[0];
	});

	first_most_tweets.sort((a, b) => b.distance - a.distance);

	sec_most_tweets = tweet_array.filter(tweet => {
		return tweet.activityType === Object.keys(sorted_activities)[1];
	});
	sec_most_tweets.sort((a, b) => b.distance - a.distance);

	third_most_tweets = tweet_array.filter(tweet => {
		return tweet.activityType === Object.keys(sorted_activities)[2];
	});
	third_most_tweets.sort((a, b) => b.distance - a.distance);


	const longest_Distance = [first_most_tweets[0], sec_most_tweets[0], third_most_tweets[0]];
	longest_Distance.sort((a, b) => b.distance - a.distance);
	
	document.getElementById('longestActivityType').innerHTML = '<strong>' + longest_Distance[0].activityType + '</strong>';
	document.getElementById('shortestActivityType').innerHTML = '<strong>' + longest_Distance[2].activityType + '</strong>';
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});