const Discord = require('discord.js');
const auth = require('./auth.json');

const client = new Discord.Client();

const token = auth.token;

client.on('ready', () => {
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
    // Send "pong" to the same channel
    message.channel.send('pong');
}
});

client.login(token);