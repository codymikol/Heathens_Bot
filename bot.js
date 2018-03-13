const Discord = require("discord.js");
const auth = require("./auth.json");
const winston = require('winston');
const request = require("request");
const client = new Discord.Client();
const token = auth.token;
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: "error" }),
        new winston.transports.File({
            filename: "combined.log",
            level: "info"
        }),
        new winston.transports.File({
            filename: "error.log",
            level: "error"
        })
    ]
});

client.on("ready", function(){
    logger.info("Bot started successfully!");
});

client.on("message", function (message) {
    //Commands
    if(message.content.substring(0,1) === "!"){
        let msg = message.content.split(" ");
        let cmd = msg[0].substring(1);

        switch(cmd){
            case "ping":
                message.channel.send("pong");
                break;
            case "gif":
                let searchTerm = encodeURI(msg.splice(1).toString());
                let url = 'http://api.giphy.com/v1/gifs/search?q=' + searchTerm + '&api_key=' + auth.giphyToken;

                request(url, function (error, response, body) {
                    if(!error && response.statusCode === 200){
                        let content = JSON.parse(body);
                        let item = Math.floor(Math.random() * 10);
                        message.channel.send(content.data[item].images.fixed_height.url);
                    }
                    else{
                        message.channel.send("An unexpected error occurred. Please try again.");
                        logger.error(error);
                    }
                });
                break;
            case "roll":
                let param = msg[1];
                let re = new RegExp('[\\d]+d[\\d]+');
                if(param != null && param.match(re)!= null){
                    let rollResult = rollDice(param);
                    let total = rollResult[1];
                    let rollsArray = rollResult[0];
                    message.channel.send('You rolled: ' + total + " (" + rollsArray.toString() + ")");
                }
                else{
                    message.channel.send('Invalid dice param.');
                }
                break;
        }
    }
    //Responder
    else{

    }
});

client.login(token);

function rollDice(param) {
    let dIndex = param.search("d");
    let numDice = Math.floor(Number(param.substring(0,dIndex)));
    let numSides = Math.floor(Number(param.substring(dIndex+1)));
    let total = 0;
    let rollsArr = Array();

    for(let i = 0; i < numDice; i++){
        let result = Math.floor(Math.random() * numSides) + 1;
        rollsArr[i] = result;
        total += result;
    }

    return [rollsArr, total];
}