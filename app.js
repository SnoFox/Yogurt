var irc = require("irc");
var cfg = require("./config.js");
var fs = require("fs");
var moduleFiles = fs.readdirSync("modules/");
var modules = [];
for(idx in moduleFiles) {
	var moduleFile = moduleFiles[idx];
	if(moduleFile.match(/.*\.js$/i)) modules.push(require("./modules/" + moduleFile));
}

var bot = new irc.Client(cfg.server, cfg.nick, {
	channels: cfg.channels
});

for(idx in modules) {
	var modName = modules[idx].name;
	console.log("Registering " + modName);
	new modules[idx](bot, cfg[modName]);
}

// Silently discard IRC errors without crashing the bot
bot.addListener("error", function(msg) {});
process.on("SIGHUP", function() {
	bot.disconnect("Caught deadly SIGHUP");
});
