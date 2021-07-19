const { MessageAttachment } = require('discord.js');
const { generateCsv, getFile, checkPresence } = require("../../../utils");

module.exports = {
    name: 'presence',
    description: 'Send a message to a specific text channel and look for specifique emoji (👍) to count presence for an activity, it return the list on mp',
    usage: 'attached_file timestamp file_name',
    options: '\n\tattached_file\tthe name of the file where I get my reference to compute presence.\n\ttime\t\t\t\t\ttime in minutes.\n\tfile_name\t\t  the name of the file you want me to produce.',
    async execute(message, args) {
        message.channel.send('Work in progress.');
        if (args.length < 1 || args.length >= 4)
            message.reply("Not enough arguments... require at least one, see aer? help command.");

        // TODO: check if time is not negativ
        const timeReact = args.length > 1 ? +args[1] : 5;
        const activityName = args[2];
        const attachedFile = getFile(args[0], message);
        const buffer = [];
        const author = message.author;

        if (!attachedFile) return;

        const filter = (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag} => ${reaction.emoji.name === '👍'}`);
            buffer.push(user.id);
            return reaction.emoji.name === '👍';
        };

        const res = await message.channel.send("REACT HERE WITH 👍 PLEASE");

        res.awaitReactions(filter, {max: 3, time: timeReact * 60000, errors: ['time']})
        .catch(() => {
            console.log("end...");
            console.log(buffer);
            checkPresence(buffer, attachedFile).then(pres => {
                const filePath = path.join(__dirname, `../../../cache/${activityName}.csv`);
                const fileLocation = generateCsv(pres, message, filePath);

                if (fileLocation == null) return;

                const attachment = new MessageAttachment(fileLocation, `${activityName}.csv`)

                author.send('Presence processed for activity: .', attachment).catch(err => console.error(err));
            }).catch(err => console.error(err));
        });
    }
}
