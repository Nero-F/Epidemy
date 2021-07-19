const { generateCsv, getFile } = require('../src/utils');
const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '/cache');

beforeAll(async () => {
    fs.mkdirSync(cachePath, {recursive: true}, err => {
        if (err)
            throw err;
        console.log('cache folder is created');
    });
});

//afterAll(async () => {
    //fs.rmdirSync(cachePath, {recursive: true}, err => {
        //if (err)
            //throw err;
        //console.log('cache folder is deleted');
    //});
//});

describe('utils funcs', () => {
    const message = {
        author: {
            send: jest.fn().mockResolvedValue({ 
                channel: {
                    send: jest.fn(),
                },
                awaitReactions: jest.fn().mockResolvedValue({})
            })
        },
        reply: jest.fn(),
    };
    const data =  'login;Présent\nfoo.bar@epitech.eu;present\n'; 
    const filePath = cachePath + '/test.csv';

    test('generateCsv work', () => {
        const res = generateCsv(data, message, filePath);
        expect(fs.existsSync(cachePath)).toBe(true);
        expect(res).toEqual(filePath);
        expect(fs.readFileSync(res, 'utf-8')).toEqual(data);
    });
    test('generateCsv check err', () => {
        const res = generateCsv(data, message, null);
        expect(message.author.send).toHaveBeenCalledWith('An error occured, can\'t save the file, please retry');
        expect(res).toEqual(null);
    });
});
