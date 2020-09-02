const aers = require('./config/aer.json');

const getAERNameList = () => {
    const nameList = []

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
    console.log(nameList);
    return nameList;
};

module.exports = {
    getAERNameList,
    getAERNameListFromPromotion
};
