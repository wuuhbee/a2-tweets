class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        const textLower = this.text.toLowerCase();

        if (textLower.includes("right now") || textLower.includes("live")) {
            return "live_event";
        } else if (textLower.includes("completed") || textLower.includes("posted")) {
            return "completed_event";
        } else if (textLower.includes("achieved") 
            || textLower.includes("achievement") 
            || textLower.includes("goal") 
            || textLower.includes("milestone") 
            || textLower.includes("reached") 
            || textLower.includes("personal record") 
            || textLower.includes("personal best") 
            || textLower.includes("new pb") 
            || textLower.includes("new pr")) {
            return "achievement";
        }

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
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
        // finalText += this.text.slice(lastIndex); // to include the hashtag after link
        return finalText;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        const textLower = this.text.toLowerCase();
        if (textLower.includes("run")) {
            return "run";
        } else if (textLower.includes("walk")) {
            return "walk";
        } else if (textLower.includes("bike")) {
            return "bike";
        } else if (textLower.includes("swim")) {
            return "swim";
        }

        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const distancePattern = /\b(\d+(?:\.\d+)?)\s*(mi|km)/i;
        const match = this.text.match(distancePattern);
        if (match) {
            let distance = Number(match[1]);
            if (match[2].toLowerCase() === "km") {
                distance *= 0.621371; // Convert kilometers to miles
            }
            return distance;
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let row = document.createElement('tr');

        let num = document.createElement('td');
        num.textContent = (rowNumber + 1).toString();
        row.appendChild(num);

        let activity = document.createElement('td');
        activity.textContent = this.distance.toFixed(2) + " mi";
        row.appendChild(activity);

        let text = document.createElement('td');
        text.innerHTML = this.writtenText;
        row.appendChild(text);

        return row.outerHTML;
    }
}