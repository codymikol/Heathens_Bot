const Discord = require("discord.js");
const auth = require("./auth.json");
const winston = require('winston');
const client = new Discord.Client();
const token = auth.token;
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'error' }),
        new winston.transports.File({
            filename: 'combined.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'error.log',
            level: 'error'
        })
    ]
});

client.on("ready", function(){
    logger.log("info", "Bot started successfully!");
});

client.on("message", function (message) {
    //Commands
    if(message.content.substring(0,1) === "!"){
        var msg = message.content.split(" ");
        var cmd = msg[0].substring(1, msg[0].length);

        if(cmd === "ping"){
            message.channel.send("pong");
        }
    }
    //Responder
    else{

    }
});

client.login(token);