/*
 * Console module for Yogurt
 * Provides an operator-facing console for... Reasons
 */


module.exports = BotConsole;

var readline = require("readline");
var bot;
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function BotConsole(bawt) {
	bot = bawt;
	bot.addListener("message", handleMessage);
	console.log("Console loaded!");
}

function handleMessage(from, to, msg) {
	console.log("[%s] <%s> %s", to, from, msg);
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

rl.setPrompt("> ");
rl.prompt();

rl.on("line", function(l) { handleLine(l); rl.prompt() });
