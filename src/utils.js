const {async_client} = require('./redis_cache');
const fs = require('fs');

const checkPresence = async (ids, attachedFile) => {
    let toFormat = "login;Présent\n";

    const data = fs.readFileSync(attachedFile, 'UTF-8');
    const lines = data.split("\n");

    try {
        await Promise.all(ids.map(async id => {
            async_client.get(id).then(reply => {
                console.log("====>", lines.includes(`${reply};`));
                if (lines.includes(`${reply};`))
                    toFormat += `${reply};present\n`;
            });
        }))
    } catch (err) {
        console.error(err);
    }
    //for all login in lines check if it is on toFormat and put absent
    lines.shift();
    lines.forEach(login => {
        if (!toFormat.includes(`${login}present\n`))
            toFormat += `${login}absent\n`;
    });
    console.log(toFormat);
    return toFormat;
}

const getFile = (fileName, message) => {
    message.reply(`Searching for ${fileName} in memory...`)
    const filePath = `${__dirname}/attachments/${fileName}`
    const file = fs.existsSync(`${__dirname}/attachments/${fileName}`);

    if (file) message.reply(`File requested: OK`);
    else message.reply(`File: ${fileName} not find!`);

    return filePath;
}

const generateCsv = (data, message, filePath) => {
    try {
        fs.writeFileSync(filePath, data, 'utf-8');
        console.log(`${filePath} Saved.`);
    } catch (err) {
        console.error('An error occured, can\'t save the file', err);
        message.author.send('An error occured, can\'t save the file, please retry');
    }
    return filePath;
};

module.exports = {
    getFile,
    generateCsv,
    checkPresence
};
