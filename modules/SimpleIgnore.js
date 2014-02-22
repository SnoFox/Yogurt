/*
 * Yogurt IRC bot module
 * Ignores nicks defined by config
*/

module.exports = SimpleIgnore;

var bot;
var nicks;

function SimpleIgnore(bawt, cfg) {
	bot = bawt;
	if(cfg == undefined) {
		bot.console.log("No config - abort");
		return;
	}
	nicks = cfg.nicks;
	bot.irc.on("message", handleMessage, 10);
	bot.console.log("SimpleIgnore loaded!");
}

function handleMessage(from, to, msg) {
	for(idx in nicks) {
		if(nicks[idx].toLowerCase() == from.toLowerCase()) return false;
	}
}
