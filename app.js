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
	console.log("Registering " + modules[idx].name);
	new modules[idx](bot);
}

// Silently discard IRC errors without crashing the bot
bot.addListener("error", function(msg) {});
process.on("SIGHUP", function() {
	bot.disconnect("Caught deadly SIGHUP");
});
