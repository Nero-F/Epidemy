const aers = require('./config/aer.json');

const getAERNameList = () => {
    const nameList = []

    console.log(aers.AER);
    aers.AER.forEach( aer => {
        nameList.push(`${aer.name} ---> ${aer.promo} ---> ${aer.mail}`);
    });
    console.log(nameList);
    return nameList;
};

module.exports = {
    getAERNameList
};
