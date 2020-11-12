const prefix = process.env.DISCORD_PREFIX_ADMIN;

module.exports = {
	name: 'help',
	description: 'List all of my aer\'s commands or infos about a specific command.',
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
        const data = [];
        const { commandsAdm } = message.client;

        console.log(args);

        if (!args.length) {
            console.log(args.length);
            data.push('Here\'s a list of all my commands:\n');
            data.push(commandsAdm.map(command => command.name).join(',\n'));
            data.push(`\nYou can send \`${prefix} help [command name]\` to get info on a specific command!`);

            return message.author.send(data, { split: true })
                    .then(() => {
                        if (message.channel.type === 'dm') return;
                        message.reply('I\'ve sent you a DM with all my commands!');
                    })
                    .catch(error => {
                        console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                        message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                    });
        }

        const target = args.shift();
        const command = commandsAdm.get(target);
        
        if (command == undefined) {
            message.reply(`Commands '${target}', may not exists, just try: aer! help, to get all commands.`);
            return;
        }
        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix} ${command.name} ${command.usage}`);
        if (command.options) data.push(`**Options:** ${command.options}`);

        message.channel.send(data, { split: true });
	},
};
