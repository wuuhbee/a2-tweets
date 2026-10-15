function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// sort tweets by time oldest to newest
	tweet_array.sort(function(a, b) {
		return a.time - b.time;
	});

	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	let firstDate = (tweet_array[0].time).toLocaleDateString(undefined, options);
	let lastDate = (tweet_array[tweet_array.length - 1].time).toLocaleDateString(undefined, options);

	const totalTweets = tweet_array.length;
	document.getElementById('numberTweets').innerText = totalTweets;
	document.getElementById('firstDate').innerText = firstDate;
	document.getElementById('lastDate').innerText = lastDate;

	completed_tweet_array = tweet_array.filter(function(tweet) {
		return tweet.source === 'completed_event';
	});
	const totalCompletedEvents = completed_tweet_array.length;
	document.getElementsByClassName('completedEvents')[0].innerText = totalCompletedEvents;
	document.getElementsByClassName('completedEventsPct')[0].innerText = ((totalCompletedEvents / totalTweets) * 100).toFixed(2) + '%';

	live_tweet_array = tweet_array.filter(function(tweet) {
		return tweet.source === 'live_event';
	});
	const totalLiveEvents = live_tweet_array.length;
	document.getElementsByClassName('liveEvents')[0].innerText = totalLiveEvents;
	document.getElementsByClassName('liveEventsPct')[0].innerText = ((totalLiveEvents / totalTweets) * 100).toFixed(2) + '%';

	achivement_tweet_array = tweet_array.filter(function(tweet) {
		return tweet.source === 'achievement';
	});
	const totalAchievements = achivement_tweet_array.length;
	document.getElementsByClassName('achievements')[0].innerText = totalAchievements;
	document.getElementsByClassName('achievementsPct')[0].innerText = ((totalAchievements / totalTweets) * 100).toFixed(2) + '%';

	misc_tweet_array = tweet_array.filter(function(tweet) {
		return tweet.source === 'miscellaneous';
	});
	const totalMiscellaneous = misc_tweet_array.length;
	document.getElementsByClassName('miscellaneous')[0].innerText = totalMiscellaneous;
	document.getElementsByClassName('miscellaneousPct')[0].innerText = ((totalMiscellaneous / totalTweets) * 100).toFixed(2) + '%';

	written_tweet_array = tweet_array.filter(function(tweet) {
		return tweet.written === true;
	});
	const totalWritten = written_tweet_array.length;
	document.getElementsByClassName('written')[0].innerText = totalWritten;
	document.getElementsByClassName('writtenPct')[0].innerText = ((totalWritten / totalTweets) * 100).toFixed(2) + '%';
	document.getElementsByClassName('completedEvents')[1].innerText = totalCompletedEvents; 
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});