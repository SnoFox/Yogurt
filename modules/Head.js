/*
 * Yogurt IRC bot module
 * Gives head
*/

module.exports = Head;

var request = require("request").defaults({followAllRedirects: true, strictSSL: false});
var Cheerio = require("cheerio");
var humanize = require("humanize");
var bot;

function Head(bawt, cfg) {
	bot = bawt;
	bot.irc.on("message", handleMessage, 10);
	bot.console.log("Head loaded!");
}

function handleMessage(from, to, msg) {
	var matches = msg.match(/https?:\/\/\S+/gi);
	if(matches != undefined && matches.length != 0) {
		for(idx in matches) {
			var url = require('url').parse(matches[idx]);
			opts = {method: "HEAD", url: url};
			request(opts, function(e, r, b) { handleHead(e, r, b, to, url) })
		}
	}
}

function handleHead(error, resp, body, chan, url) {
	if(checkErrors(error, resp, chan, url)) return;
	var contentType = getContentType(resp);
	if(contentType != "text/html") {
		reportContentType(resp, chan);
		return;
	}
	var opts = {method: "GET", url: url};
	request(opts, function(e, r, b) { handleGet(e, r, b, chan) });
}

function handleGet(error, resp, body, chan) {
	if(checkErrors(error, resp, chan)) return;
	var contentType = getContentType(resp);
	if(contentType != "text/html") {
		reportContentType(resp, chan);
		return;
	}
	var $ = Cheerio.load(body);
	var title = $("title").text().trim();
	if(title == undefined || title == "") {
		msg(chan, "Site has no title.");
		return;
	}
	msg(chan, title);
}

function getContentType(resp) {
	return resp.headers["content-type"].split(";")[0];
}

function getContentLength(resp) {
	return resp.headers["content-length"];
}

function reportContentType(resp, where) {
	var type = getContentType(resp);
	var length = getContentLength(resp);
	length = humanize.filesize(length);
	msg(where, "Link content is " + type +" (" + length +")");
}

// Returns true if there was an error; false otherwise
function checkErrors(error, resp, chan, url) {
	if(error) {
		msg(chan, "Error: " + error);
		return true;
	}
	if(resp.statusCode == 200) {
		return false;
	} else if(resp.statusCode == 405) {
		var methods = resp.headers["allow"].split(" ");
	for(idx in methods) if(methods[idx].toUpperCase() == "GET" && url != undefined) {
			request({method: "GET", url: url}, handleGet);
			return true;
		}
	}
	msg(chan, "Site returned " + resp.statusCode);
	return true;
}

function msg(chan, msg) {
	bot.irc.say(chan, "[URL] " + msg);
}
