class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        return "unknown";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        const keywords = ["with @Runkeeper", "with #Runkeeper", "Check it out!", "TomTom MySports Watch"];
        if (keywords.some(keyword => this.text.includes(keyword))) {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        let finalText = "";
        const linkPattern = /https?:\/\/[^\s<>"']+/gi;
        let lastIndex = 0;

        for (const match of this.text.matchAll(linkPattern)) {
            const matchIndex = match.index;
            const matchedText = match[0];
            const url = matchedText.replace(/[.,!?;:)\]]+$/, '');
            const trailingText = matchedText.slice(url.length);

            finalText += this.text.slice(lastIndex, matchIndex);

            let link = "<a href=\"";
            link += url + "\">";
            link += url + "</a>";
            finalText += link;
            finalText += trailingText;

            lastIndex = matchIndex + matchedText.length;
        }
        finalText += this.text.slice(lastIndex);
        return finalText;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let row = document.createElement('tr');

        let num = document.createElement('td');
        num.textContent = (rowNumber + 1).toString();
        row.appendChild(num);

        let activity = document.createElement('td');
        activity.textContent = this.source;
        row.appendChild(activity);

        let text = document.createElement('td');
        text.innerHTML = this.writtenText;
        row.appendChild(text);

        return row.outerHTML;
    }
}