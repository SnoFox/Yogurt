var irc = require("irc");
var cfg = require("./config.js");
var fs = require("fs");
var BotConsole;
var moduleFiles = fs.readdirSync("modules/");
var moduleConstructors = [];
var modules = {};
for(idx in moduleFiles) {
	var moduleFile = moduleFiles[idx];
	if(moduleFile.match(/.*\.js$/i)) moduleConstructors.push(require("./modules/" + moduleFile));
}

var bot = new irc.Client(cfg.server, cfg.nick, {
	channels: cfg.channels
});

for(idx in moduleConstructors) {
	var modName = moduleConstructors[idx].name;
	console.log("Registering " + modName);
	modules[modName] = new moduleConstructors[idx](bot, cfg[modName]);
	if(modName == "BotConsole") BotConsole = modules[modName];
}

// Silently discard IRC errors without crashing the bot
//bot.addListener("error", function(msg) {});
process.on("SIGHUP", function() {
	bot.disconnect("Caught deadly SIGHUP");
});

function doLog(msg) {
	if(BotConsole == undefined) console.log(msg);
	else BotConsole.log(msg);
}
