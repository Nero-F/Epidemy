const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const { getAerObjListFromKey } = require('../aer');

client.commands = new Discord.Collection();
client.commandsAdm = new Discord.Collection();
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));
const commandFilesAdm = fs.readdirSync(__dirname + '/commands/adm').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
for (const file of commandFilesAdm) {
    const commandAdm = require(`./commands/adm/${file}`);
    client.commandsAdm.set(commandAdm.name, commandAdm);
}

const aerListId = getAerObjListFromKey('discordId');

const BOT_TOKEN = process.env.NODE_ENV === "develop" ? process.env.BOT_TOKEN_DEV : process.env.BOT_TOKEN;
const prefix = process.env.DISCORD_PREFIX;
const prefixAdmin = process.env.DISCORD_PREFIX_ADMIN;

client.once('ready', () => console.log('Bot Is Ready'));
client.on('message', message => {
    const is_from_aer = aerListId.find(id => id === message.author.id) == undefined ? false : true;
    const msgContent = message.content;

    if ((!msgContent.startsWith(prefix) && !msgContent.startsWith(prefixAdmin)) || message.author.bot) return;

    let w_collection;
    let w_prefix = "";

    if (msgContent.startsWith(prefix)) {
        if (message.channel.type !== 'dm' && !is_from_aer) {
            message.reply(`You can only call me via DMs...`);
            return;
        }
        w_prefix = prefix;
        w_collection = client.commands; 
    } else {
        w_prefix = prefixAdmin;
        w_collection = client.commandsAdm;
        if (!is_from_aer) {
            message.reply('You\'re not part of the AER\'s GVNG so you cannot access to these commands :P');
            return;
        }
    }

    const args = msgContent.slice(w_prefix.length).trim().split(' ');
    const command = args.shift();

    if (!w_collection.has(command)) {
        message.reply(`The command '${command}' does not exist... Please refer to ${w_prefix} help`);
        return;
    }
    try {
        w_collection.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command sry :(');
    }
});

client.login(BOT_TOKEN);

module.exports = client;
