const prefix = process.env.DISCORD_PREFIX;
console.log(`prefix: ${prefix}`);

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:\n');
            data.push(commands.map(command => command.name).join(',\n'));
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
        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
	},
};
