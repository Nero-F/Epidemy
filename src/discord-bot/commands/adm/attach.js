const fs = require('fs');
const request = require('request');
const path = require('path');

const attach_path = path.join(__dirname, `./attachments`);

if (!fs.existsSync(attach_path)) {
    console.log('Create attachments directory');
    fs.mkdirSync(attach_path);
}

const download = (url, name) => {
    request.get(url).on('error', console.error)
        .pipe(fs.createWriteStream(`${attach_path}/${name}`));
};

const rm_file = (message, name) => {
    const path = `${attach_path}/${name}`;
    if (!fs.existsSync(path)) {
        message.reply('The file You wanna delete does not exist. refers to attach -l to see full list.');
    } else {
        fs.unlinkSync(path);
        message.reply('File deletion success.');
    }
}

const list_file = (message) => {
    const files = fs.readdirSync(attach_path);
    const output = files.join('\n=> ');

    if (file.length > 0)
        message.reply(`List of in memory files\n\n=> ${output}`)
    else 
        message.reply('No file in memory');
}

module.exports = {
    name: 'attach',
    description: 'Attach the exported from intranet, give it a name and use it make presence!',
    execute(message, args) {
        const has_attachement = message.attachments.size == 1 ? true : false;
        
        if (args.length == 2 && args[0] == '-r') {
            rm_file(message, args[1]);
            return;
        } else if (args.length == 1 && args[0] == '-l') {
            list_file(message);
            return;
        }
        const name = args.shift();
        

        if (!has_attachement) {
            message.reply('You need to attach one file with this command? see aer? help attach')
            return;

        } else if (fs.existsSync(`attach_path/${name}`)) {
            message.reply('The name given to the command already exist, please try with another one');
            return;
        } else if (name === undefined) {
            message.reply('You have to provide a name in order for me to keep it in memory and make it accessible for the presence command');
            return
        }
        download(message.attachments.first().url, name);
        message.reply('File correctly saved');
    },
};

