const tokensFunc = require('../../tokens');
const calendarService = require('../../graph');
const aers = require('../../config/aer.json')
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const serializeResponse = (response) => {
    let arr = [];

    response.forEach(elem => {
        let parseID = elem.subject.split('-').map(part => { return part.trim() });
        let start = moment(elem.start.dateTime);
        let end = moment(elem.end.dateTime);
        arr.push({
            name: parseID[0],
            activity: parseID[1],
            date: `${start.format('dddd')} ${start.format('LT')} - ${end.format('LT')}`
        });
    });
    return arr;
};

const printLineBorders = (paddings, namePadder = true) => {
    let str = "";
    for (let i = 0; i != paddings.length; i++) {
        str += '+';
        process.stdout.write('+');
        for (let y = 0 ; y <= paddings[i] ; y++) {
            str += !namePadder && i == 0 ? ' ' : '-';
            process.stdout.write(!namePadder && i == 0 ? ' ' : '-');
        }
    }
    str += '+\n';
    process.stdout.write('+');
    process.stdout.write('\n');
    return str;
}

// TODO: refacto to make it more generic and more readable
const printInValue = (values, paddings) => {
    let name_temp = "";
    let namePadder = true;
    let count = 0;
    let str = "";

    values.forEach(aer => {
        str += '|';
        process.stdout.write('|');
        if (name_temp != aer.name) {
            str += aer.name;
            process.stdout.write(aer.name);
            name_temp = aer.name;
            for (let i = aer.name.length; i <= paddings[0]; i++) {
                str += ' ';
                process.stdout.write(' ');
            }
            namePadder = true;
        } else {
            for (let i = 0; i != paddings[0]+ 1; i++) {
                str += ' ';
                process.stdout.write(' ');
            }
            namePadder = false;
        }
        str += '|' + aer.activity;
        process.stdout.write('|');
        process.stdout.write(aer.activity);
        for (let i = aer.activity.length; i <= paddings[1]; i++) {
            str += ' ';
            process.stdout.write(' ');
        }
        str += '|' + aer.date;
        process.stdout.write('|');
        process.stdout.write(aer.date);
        for (let i = aer.date.length; i <= paddings[2]; i++) {
            str += ' ';
            process.stdout.write(' ');
        }
        str += '|\n';
        process.stdout.write('|');
        process.stdout.write('\n');
        if (count == values.length - 1)
            namePadder = true;
        str += printLineBorders(paddings, namePadder);
        count++;
    });
    str += '\n';
    process.stdout.write('\n');
    return str;
};

const adaptiveTable = (object) => {
    let padName = 0;
    let padActivity = 0;
    let padTime = 0;
    let result = "";

    object.forEach(aer => {
        if (aer.name.length > padName)
            padName = aer.name.length;
        if (aer.activity.length > padActivity)
            padActivity = aer.activity.length;
        if (aer.date.length > padTime)
            padTime = aer.date.length;
    });
    padTab = [padName, padActivity, padTime]
    result += printLineBorders(padTab);
    result += printInValue(object, padTab);
    result = '```\n' + result + '\n```';
    return result;
};

module.exports = {
    name: 'week-avail',
    description: 'Check the availiability of an AER in the current Week',
    execute(message, args) {
        let validation_table = []; // Only purpose is to check wether the name exist without blocking the the command

        console.log("args");
        console.log(args);
        if (args.length > 0) {
            args.forEach(name => {
                aers.AER.forEach(aer => {
                    console.log(aer.name);
                    if (name.toLowerCase() === aer.name.toLowerCase())
                        validation_table.push(name.toLowerCase());
                });
                if (!validation_table.includes(name.toLowerCase()))
                    message.reply(`Nobody has the name ${name} please retry with a correct name (see: list<command>)`);
            });
            if (validation_table.length === 0) return;
        } else {
            message.reply(`This commands should have at least one argument`);
            return;
        }

        tokensFunc.retrieveTokenFromDb().then(token => {
            validation_table.forEach(name => {
                console.log('----------------------------');
                console.log(name);
                calendarService.getWeekAERAvailiabityByName(token, name).then((res) => {
                    if (res.length == 0) {
                        message.channel.send(`${name} has no Event assigned this week...`);
                        return;
                    }
                    const aerTimeSheet = serializeResponse(res);
                    const table = adaptiveTable(aerTimeSheet);

                    const embed = new MessageEmbed()
                        .setTitle(`Availiability: ${name}`)
                        .setColor(0xE37A16)
                        .setDescription(table);
                    message.channel.send(embed);
                }).catch(err => {
                    console.error(err);
                    message.channel.send('The server is not running...');
                });
            }).catch(error => console.error(error));
        });
    },
};
