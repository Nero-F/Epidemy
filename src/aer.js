const aers = require('./config/aer.json');

// TODO: Write somewhere every skills vailiable to propose when skills is not found 
const getAERNameListFromSkill = (message, skill) => {
    const nameList = [];


    aers.AER.forEach(aer => {
        let buffer = aer.skills.map(elem => elem.toLowerCase());

        buffer.forEach(_ => {
            if (skill.trim().toLowerCase() === _) {
                nameList.push(`${aer.name} ---> ${aer.promo} ---> ${aer.mail}`);
            }
        });
    });

    if (nameList.length == 0) {
        message.channel.send("Error: Either the skill does not exist or we don't have that compentence sorry :(.");
        return null; 
    }
    return nameList;
}

const getAERNameList = () => {
    const nameList = [];

    aers.AER.forEach( aer => {
        nameList.push(`${aer.name} ---> ${aer.promo} ---> ${aer.mail}`);
    });
    return nameList;
};

const getAERNameListFromPromotion = (message, promotion) => {
    const nameList = []
    const regex = new RegExp('^tek[2-3-5]');

    if (regex.exec(promotion) === null) {
        message.channel.send('The argument should be in this format: "tek(2|3|5)"');
        return null;
    }
    aers.AER.forEach(aer => {
        if (aer.promo == promotion) {
            nameList.push(`${aer.name} ---> ${aer.mail}`);
        }
    });
    return nameList;
};

module.exports = {
    getAERNameList,
    getAERNameListFromPromotion,
    getAERNameListFromSkill 
};
