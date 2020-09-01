const aer = require('../../aer');
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'list',
    description: 'List all AERs in the server!',
    execute(message, args) {
        let list = [];
        let desc = ""

        if (args.length != 0) {
            message.reply('This command does not need arguments.');
            return;
        }
        list = aer.getAERNameList()
        desc = list.join('\n');
        console.log(desc);
        
        const embed = new MessageEmbed()
            .setTitle('List Of Your Very Talentuous AERs')
            .setColor(0xE37A16)
            .setDescription(desc);
        
        message.channel.send(embed);
    },
};
