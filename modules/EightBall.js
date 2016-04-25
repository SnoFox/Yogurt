/*
 * Yogurt IRC bot module
 * Ignores nicks defined by config
*/

module.exports = EightBall;

var bot;
var nicks;

function EightBall(bawt, cfg) {
	bot = bawt;
	if(cfg == undefined) {
		bot.console.log("No config - abort");
		return;
	}
	replies = cfg.replies;
	bot.irc.on("message", handleMessage, 10);
	bot.console.log("8Ball loaded!");
}

function handleMessage(from, to, msg) {
	var cmd = msg.indexOf(' ');
	cmd = msg.substr(0, cmd);
	cmd = cmd.toLowerCase();
	if(cmd == "!8ball") {
		var num = Math.floor(Math.random()*replies.length)
		sendMsg(to, replies[num]);
	}
}

function sendMsg(chan, msg) {
	bot.irc.say(chan, "[8Ball] " + msg);
}
