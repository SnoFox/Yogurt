var util = require('util');
var fs = require("fs");
var bot = {};
var EventPipe = require("eventpipe").EventPipe;
var EventEmitter = require("events").EventEmitter;
util.inherits(EventEmitter, EventPipe);
var cfg = require("./config.json");
var irc = require("irc");
var moduleFiles = fs.readdirSync("modules/");
var moduleConstructors = [];
bot.modules = {};
bot.console = {log: console.log};
for(idx in moduleFiles) {
	var moduleFile = moduleFiles[idx];
	if(moduleFile.match(/.*\.js$/i)) moduleConstructors.push(require("./modules/" + moduleFile));
}

bot.irc = new irc.Client(cfg.core.server, cfg.core.nick, cfg.core);

for(idx in moduleConstructors) {
	var modName = moduleConstructors[idx].name;
	bot.console.log("Registering " + modName);
	bot.modules[modName] = new moduleConstructors[idx](bot, cfg[modName]);
	if(modName == "BotConsole") bot.console = bot.modules[modName];
}

// Silently discard IRC errors without crashing the bot
bot.irc.addListener("error", function(msg) {
	doLog("Error: " + require("util").inspect(msg));
});

process.on("SIGHUP", function() {
	bot.disconnect("Caught deadly SIGHUP");
});

function doLog(msg) {
	if(bot.console == undefined) console.log(msg);
	else bot.console.log(msg);
}
