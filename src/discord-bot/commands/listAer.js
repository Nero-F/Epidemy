const aer = require('../../aer');
const {MessageEmbed} = require('discord.js');

const displayList = (promotion, list, message) => { 
    const desc = list.join('\n');
    const end = promotion === undefined ? 'AERs' : `${promotion}'s AERs`;
    
    const embed = new MessageEmbed()
        .setTitle(`List Of Your Very Talentuous ${end}`)
        .setColor(0xE37A16)
        .setDescription(desc);
    message.channel.send(embed);
};

module.exports = {
    name: 'list',
    description: 'List all AERs in the server!',
    execute(message, args) {
        const option = args.shift();
        let list = [];

        let fctPointer = {
            'promo' : aer.getAERNameListFromPromotion,
            'skill': aer.getAERNameListFromSkill
        };
        if (option === undefined) {
            list = aer.getAERNameList()
            displayList(undefined, list, message);
            return
        }

        if (option.startsWith('--')) {
            const key = option.slice(2);
            if (key in fctPointer)
                list = fctPointer[key](message, args.join(' '));
            else
                message.channel.send('This command does not exist, please refer to the help command.');
            if (list !== null)
                displayList(args[1], list, message);
        } else message.channel.send('command error see help for mor informations.');
    },
};
