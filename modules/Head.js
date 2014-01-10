/*
 * Yogurt IRC bot module
 * Gives head
 */

module.exports = Head;

var request = require("request").defaults({followAllRedirects: true, strictSSL: false});
var Cheerio = require("cheerio");
var bot;

function Head(bawt) {
	bot = bawt;
	bawt.addListener("message", handleMessage);
	console.log("Head loaded!");
}

function handleMessage(from, to, msg) {
	var matches = msg.match(/https?:\/\/\S+/gi);
	if(matches != undefined && matches.length != 0) {
		for(idx in matches) {
			var url = require('url').parse(matches[idx]);
			urlOpt = {url: url};
			request.get(urlOpt, function(e, r, b) { handleHead(e, r, b, to, url) })
		}
	}
}

function handleHead(error, resp, body, chan, url) {
	if(error) {
		msg(chan, "Error: " + error);
		return;
	}
	if(resp.statusCode != 200) {
		msg(chan, "Site returned " + resp.statusCode);
		return;
	}
	var contentType = resp.headers["content-type"].split(";")[0];
	if(contentType != "text/html") {
		msg(chan, "Link content: " + contentType);
		return;
	}
	var $ = Cheerio.load(body);
	var title = $("title").text();
	if(title == undefined || title == "") {
		msg(chan, "Site has no title.");
		return;
	}
	msg(chan, title);
}

function msg(chan, msg) {
	bot.say(chan, "[URL] " + msg);
}
