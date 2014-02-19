/*
 * Yogurt IRC bot module
 * watches & announces changes in a directory ... For reasons
 */

module.exports = WatchDir;

var bot;
var watchr = require("watchr");
var chans;

function WatchDir(bawt, cfg) {
	bot = bawt;
	if(cfg == undefined) {
		bot.console.log("No config. Aborting init");
		return;
	}
	watchr.watch({
		paths: cfg.paths,
		listener: handleChange
	});
	chans = cfg.chans;
	bot.console.log("WatchDir loaded!");
}

function handleChange(changeType, path, cur, prev) {
	for(idx in chans) bot.say(chans[idx], "File " + changeType + "d: " + path);
}
