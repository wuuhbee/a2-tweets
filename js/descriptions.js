let tweet_array = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	tweet_array = tweet_array.filter(function(tweet) {
		return tweet.written === true;
	});

	renderTweets();
}

function renderTweets() {
	let keyword = document.getElementById('textFilter').value.trim().toLowerCase();
	let matchingTweets = tweet_array.filter(function(tweet) {
		return tweet.text.toLowerCase().includes(keyword);
	});

	let table = document.getElementById('tweetTable');
	table.replaceChildren();

	matchingTweets.forEach(function(tweet, index) {
		table.insertAdjacentHTML('beforeend', tweet.getHTMLTableRow(index));
	});

	document.getElementById('searchCount').textContent = matchingTweets.length;
	document.getElementById('searchText').textContent =
		document.getElementById('textFilter').value;
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('textFilter').addEventListener('input', renderTweets);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});