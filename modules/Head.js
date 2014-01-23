/*
 * Yogurt IRC bot module
 * Gives head
 */

module.exports = Head;

var request = require("request").defaults({followAllRedirects: true, strictSSL: false});
var Cheerio = require("cheerio");
var bot;

function Head(bawt, cfg) {
	bot = bawt;
	bawt.addListener("message", handleMessage);
	console.log("Head loaded!");
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
  if(checkErrors(error, resp, chan)) return;
	var contentType = resp.headers["content-type"].split(";")[0];
	if(contentType != "text/html") {
		msg(chan, "Link content: " + contentType);
		return;
	}
  var opts = {method: "GET", url: url};
  request(opts, function(e, r, b) { handleGet(e, r, b, chan) });
}

function handleGet(error, resp, body, chan) {
  if(checkErrors(error, resp, chan)) return;
 	var $ = Cheerio.load(body);
	var title = $("title").text().trim();
	if(title == undefined || title == "") {
		msg(chan, "Site has no title.");
		return;
	}
	msg(chan, title);
}

// Returns true if there was an error; false otherwise
function checkErrors(error, resp, chan) {
  	if(error) {
		msg(chan, "Error: " + error);
		return true;
	}
	if(resp.statusCode != 200) {
		msg(chan, "Site returned " + resp.statusCode);
		return true;
	}
  return false;
}

function msg(chan, msg) {
	bot.say(chan, "[URL] " + msg);
}
