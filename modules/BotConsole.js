/*
 * Console module for Yogurt
 * Provides an operator-facing console for... Reasons
 */


module.exports = BotConsole;

var bot;
var readline = require("readline");
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var sigint = 0;

function BotConsole(bawt, cfg) {
	bot = bawt;
	bot.addListener("message", handleMessage);
	console.log("Console loaded!");
}

function handleMessage(from, to, msg) {
	doLog("[" + to + "] <" + from + "> " + msg);
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

function doLog(msg) {
	rl.output.write("\x1b[2K\r");
	console.log(msg);
	rl.prompt(true);
}

rl.setPrompt("> ");
rl.prompt();

rl.on("line", function(l) { handleLine(l); rl.prompt() });
rl.on("SIGINT", function() {
	if(sigint < 1) {
		++sigint;
		doLog("Tap ^C again to kill the bot.");
	} else {
		console.log("\n\nCaught SIGINT... Bye!");
		bot.disconnect("Caught SIGINT");
		rl.close();
		process.exit(0);
	}
	setTimeout(function() { sigint = 0 }, 1000);
});
