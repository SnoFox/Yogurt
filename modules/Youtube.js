/*
 * Yogurt IRC bot module
 * Gives head
*/

module.exports = Youtube;

var Youtube = require('youtube-api');
var moment = require('moment');
var bot;
var conf;

function Youtube(bawt, cfg) {
	bot = bawt;
	if(cfg == undefined) {
		bot.console.log("Abort. No config.");
		return;
	}
	conf = cfg;
	Youtube.authenticate({type: 'key', key: cfg.key});
	bot.irc.on("message", handleMessage, 40);
	bot.console.log("Youtube loaded!");
}

Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < size) s = "0" + s;
	return s;
}

function handleMessage(from, to, msg) {
	var youtubeURL = /https?:\/\/(www\.)?youtu(be\.com|\.be)\/\S+/gi
	var matches = msg.match(youtubeURL);
	if(matches != undefined && matches.length != 0) {
		for(idx in matches) {
			var url = require('url').parse(matches[idx], true);
			if(url.pathname == "/") return;
			var videoID = undefined;
			if(url.query.v == undefined) videoID = url.pathname.split('/')[1];
			else videoID = url.query.v;
			Youtube.videos.list({part: "snippet,contentDetails", id: videoID}, function(err, data) {
				handleResp(err, data, to);
			});
		}
		return false;
	}
}

function sendMsg(chan, msg) {
	bot.irc.say(chan, "[YouTube] " + msg);
}

function handleResp(err, data, chan) {
	if(err != undefined) {
		sendMsg(chan, "Error: " + err);
		return;
	}
	if(data.items.length == 0) {
		sendMsg(chan, "Video doesn't exist?");
		return;
	}
	var videoInfo = data.items[0];
	var videoID = videoInfo.id;
	var title = videoInfo.snippet.title.trim();
	var desc = videoInfo.snippet.description;
	var playtime;
	if(videoInfo.snippet.liveBroadcastContent == "none") playtime = videoInfo.contentDetails.duration;
	else playtime = videoInfo.snippet.liveBroadcastContent;
	var out = "[" + clockTime(playtime) + "] " + title + " | Description: " + shortDesc(desc) + " | Full video: http://youtu.be/" + videoID;
	sendMsg(chan, out);
}

function shortDesc(desc) {
	var desc = desc.split("\n");
	for(idx in desc) {
		desc[idx] = desc[idx].trim();
	}
	var out = '';
	var first = true;
	var done = false;
	for(idx in desc) {
		if(done) break;
		var line = desc[idx].split(" ");
		for(wordNum in line) {
			if(!first) out += " ";
			out += line[wordNum];
			first = false;
			if(out.length >= conf.descLength) {
				done = true;
				out += " ...";
				break;
			}
		}
		if(idx != (desc.length-1) && !done) out += " /";
	}
	return out;
}

function clockTime(playtime) {
	if (playtime == "upcoming") return "Upcoming Broadcast";
	if (playtime == "live") return "Live now!";
	playtime = moment.duration(playtime)
	var out = "";
	var dat = playtime._data;
	if(dat == undefined) return "undef";
	if(dat.years > 0) out += dat.years + "Y ";
	if(dat.months > 0) out += dat.months + "M ";
	if(dat.days > 0) out += dat.days + "D ";
	if(dat.hours > 0) out += dat.hours + ":";
	out += dat.minutes.pad(2) + ":";
	out += dat.seconds.pad(2);
	return out;
}
