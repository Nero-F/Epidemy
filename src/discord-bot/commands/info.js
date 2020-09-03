const aers = require('../../config/aer.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'info',
    description: 'Get informations about your Aers',
    execute(message, args) {
        let count = 0;
        // TODO: Improve this in case where aers share the same name
        for (let _ = 0; _ != args.length; _++) {
            count = 0;
            aers.AER.forEach(aer => { 
                if (args[_].toLowerCase() == aer.name.toLowerCase()) { 
                    let embed = new MessageEmbed()
                        .setTitle(aer.name)
                        .setAuthor(aer.mail)
                        .setColor('#0099ff')
                        .setThumbnail(aer.image)
                        .addFields(
                            { name: 'Languages and Tools', value: aer.skills },
                            { name: 'presentation', value: aer.presentation }
                        );
                    message.channel.send(embed);
                    ++count;
                }
            });
            if (count === 0) {
                message.channel.send(`Error: the given name > ${args[_]} < does not exist... please try 'aer! list' to see every names availiable.`);
            }
        }
    }
}
