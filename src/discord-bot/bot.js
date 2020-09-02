const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    console.log(file);
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


const BOT_TOKEN = process.env.BOT_TOKEN;

//TODO: Change this to env variables 
const prefix = 'aer!';
const SERV_ID = '438095103060344843'
const CHAN_ID = '691671860148174898';

client.on('unhandledRejection', error => {
    console.error('Unhandled promise Rejection', error);
});


client.once('ready', () => console.log('Bot Is Ready'))
client.on('message', message => {
    if (message.guild.id !== SERV_ID || message.channel.id !== CHAN_ID) return;
    msg_content = message.content;
    
    if (!msg_content.startsWith(prefix) || message.author.bot) return;

    console.log(msg_content);
    const args = msg_content.slice(prefix.length).trim().split(' ');

    const command = args.shift();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command sry :(');
    }
});

client.login(BOT_TOKEN);

module.exports = client;
