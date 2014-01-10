/*
 * Console module for Yogurt
 * Provides an operator-facing console for... Reasons
 */


module.exports = BotConsole;

var bot;
var that;
var moment = require("moment");
var readline = require("readline");
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var sigint = 0;

function BotConsole(bawt, cfg) {
	bot = bawt;
	that = this;
	bot.addListener("message", handleMessage);
}

BotConsole.prototype.log = function(msg, ts) {
	if(ts == undefined) ts = true;
	doLog(msg, ts);
}

function handleMessage(from, to, msg) {
	that.log("[" + to + "] <" + from + "> " + msg);
}

function handleLine(line) {
	if(line.length < 1) return; // Ignore empty lines
	if(line[0] == "/") {
		handleCmd(line);
		return;
	}
	var argv = line.split(" ");
	bot.say(argv.shift(), argv.join(" "));
}

function handleCmd(line) {
	// XXX commands NYI :D
	return;
}

function doLog(msg, ts) {
	var now = moment().format("YYYY-MM-DD HH:mm:ss");
	rl.output.write("\x1b[2K\r");
	console.log((ts ? now + " " : "") + msg);
	rl.prompt(true);
}

rl.setPrompt("> ");
rl.prompt();

rl.on("line", function(l) { handleLine(l); rl.prompt() });
rl.on("SIGINT", function() {
	if(sigint < 1) {
		++sigint;
		doLog("Tap ^C again to kill the bot.", false);
	} else {
		console.log("\n\nCaught SIGINT... Bye!");
		bot.disconnect("Caught SIGINT");
		rl.close();
		process.exit(0);
	}
	setTimeout(function() { sigint = 0 }, 1000);
});
