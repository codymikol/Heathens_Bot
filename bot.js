const Discord = require("discord.js");
const auth = require("./auth.json");
const winston = require('winston');
const request = require("request");
const fs = require('fs-extra');
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

    if(fs.pathExistsSync('./responses.json')){
        fs.writeJsonSync('./responses.json',
            {
                "hello" : "fuck off"
            }
        );
    }
});

client.on("message", function (message){
    let msg = message.content.split(" ");
    //Commands
    if(message.content.substring(0,1) === "!"){
        let cmd = msg[0].substring(1);

        switch(cmd){
            case "ping":
                message.channel.send("pong");
                break;
            case "gif":
                let searchTerm = msg.splice(1).toString();
                let item = Math.floor(Math.random() * 10);
                getGiphyResults(searchTerm, item, message);
                break;
            case "gifs":
                let searchTermS = msg.splice(1).toString();
                getGiphyResults(searchTermS, 0, message);
                break;
            case "roll":
                let param = msg[1];
                let re = new RegExp("[\\d]+d[\\d]+");
                if(param != null && param.match(re)!= null){
                    let rollResult = rollDice(param);
                    message.channel.send("You rolled: " + rollResult[1] + " (" + rollResult[0].toString() + ")");
                }
                else{
                    message.channel.send("Invalid dice param.");
                }
                break;
        }
    }
    //Responder
    else{
        // let responses = fs.readJsonSync('.\\responses.json');
        // for(var index in msg){
        //     if(responses.msg[index] !== null){
        //         message.channel.send(responses.msg[index]);
        //     }
        // }
    }
});

client.login(token);

function rollDice(param){
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

function getGiphyResults(param, item, message){
    let url = "http://api.giphy.com/v1/gifs/search?q=" + encodeURI(param) + "&api_key=" + auth.giphyToken;
    console.log(url);

    request(url, function (error, response, body){
        if(!error && response.statusCode === 200){
            let content = JSON.parse(body);
            message.channel.send(content.data[item].images.fixed_height.url);
        }
        else{
            logger.error(error);
        }
    });
}