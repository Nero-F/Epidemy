const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const BOT_TOKEN = process.env.BOT_TOKEN;
const prefix = process.env.DISCORD_PREFIX;
const SERV_ID = process.env.DISCORD_SERV_ID;
const CHAN_ID = process.env.DISCORD_CHAN_ID;


client.once('ready', () => console.log('Bot Is Ready'));
client.on('message', message => {
    console.log(message);
    if (message.guild == undefined || 
        message.guild.id !== SERV_ID || message.channel.id !== CHAN_ID) {
        message.author.send(`You can only call me in this specific channel ${CHAN_ID}...`);
        return;
    }
    msg_content = message.content;
    
    if (!msg_content.startsWith(prefix) || message.author.bot) return;

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
